import 'reflect-metadata'
import { IValidation } from '@/contracts/validation'
import { Validation } from '@/services/validation'
import { ValidationMiddleware } from '@/services/resources/validation-middleware'
import { FoundResource } from '@/contracts/resources'
import { Headers, IResponse, Methods, Payload } from '@/contracts/http'

describe('Test validation middleware', () => {
  const validationService = new Validation()
  const validationMiddleware = new ValidationMiddleware(validationService)

  afterEach(() => {
    jest.clearAllMocks();
  })

  test('Expect [beforeCall] to register formName.', () => {
    const clearFormSpy = jest.spyOn(validationService, 'clearForm')
    const testResource: FoundResource = {
      url: '/',
      method: Methods.Get,
      shorthand: 'formName',
      auth: true
    }
    const testHeaders: Headers = { test: 'true' }
    const testBody: Payload = {}

    const result = validationMiddleware.beforeCall(testResource, testHeaders, testBody)

    // @ts-ignore - reading private property.
    expect(validationMiddleware.formName).toEqual(testResource.shorthand)
    expect(clearFormSpy).toHaveBeenCalledTimes(1)
    expect({ headers: testHeaders, body: testBody }).toEqual(result)
  })

  test('Expect [afterCall] to do emit validation errors.', () => {
    const pushErrorsSpy = jest.spyOn(validationService, 'pushErrors')
    const testResponse: IResponse = {
      data: {},
      errors: { errors: { message: 'Test error.' } },
      headers: {},
      status: 422,
      hasErrors: () => true,
      isSuccessful: () => false
    }

    validationMiddleware.afterCall(testResponse)

    expect(pushErrorsSpy).toBeCalledTimes(1)
    expect(pushErrorsSpy).toBeCalledWith(
      'formName', { message: 'Test error.' }
    )
  })

  test('Expect [afterCall] to do emit validation empty object.', () => {
    const pushErrorsSpy = jest.spyOn(validationService, 'pushErrors')
    const testResponse: IResponse = {
      data: {},
      errors: null,
      headers: {},
      status: 422,
      hasErrors: () => true,
      isSuccessful: () => false
    }

    validationMiddleware.afterCall(testResponse)

    expect(pushErrorsSpy).toBeCalledTimes(1)
    expect(pushErrorsSpy).toBeCalledWith(
      'formName', {}
    )
  })

  test('Expect [afterCall] to do nothing.', () => {
    const testResponse: IResponse = {
      data: {},
      errors: null,
      headers: {},
      status: 200,
      hasErrors: () => false,
      isSuccessful: () => true
    }

    let error
    try {
      validationMiddleware.afterCall(testResponse)
    } catch (err) {
      error = err
    }
    expect(typeof error).toBe('undefined')
  })

})
