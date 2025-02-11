import 'reflect-metadata'
import { Subscription } from 'rxjs'
import { AuthConfig, AuthEvent, IWindow, TokenDriver } from '../contracts'
import { MissingParameter } from '../exceptions/errors'

import { AuthService } from './authorization'
import { DateTime } from './datetime'

describe('Test AuthService class.', () => {
  const config: AuthConfig = {
    tokenDriver: TokenDriver.Single,
    tokenName: 'test-token',
    refreshThreshold: 5000,
    validThreshold: 1000
  }

  interface TestStorage {
    [key: string]: string
  }

  let localStorage!: TestStorage
  // TODO: @Kuba we need full qualified tests here.
  // @ts-ignore
  const windowMock = jest.fn() as IWindow
  windowMock.onFocus = (callback: any) => {}

  beforeEach(() => {
    window.localStorage.getItem = (key: string) => {
      return localStorage[key]
    }

    window.localStorage.setItem = (key: string, value: string) => {
      localStorage[key] = value
    }
  })

  afterEach(() => {
    localStorage = {} as TestStorage
  })

  test('Expect [check] to do fail.', () => {
    const auth = new AuthService(config, windowMock)
    const result = auth.check()

    expect(result).toBe(false)
  })

  test('Expect [check] to do check.', () => {
    const auth = new AuthService(config, windowMock)
    // @ts-ignore
    auth._token = new auth._driver({
      accessToken: 'test-token',
      expiresAt: new Date().toUTCString(),
      tokenType: 'Bearer',
    }, new DateTime())

    const result = auth.check()

    expect(result).toBe(false)
  })

  test('Expect [check] to do check.', () => {
    const auth = new AuthService(config, windowMock)
    // @ts-ignore
    auth._token = new auth._driver({
      accessToken: 'test-token',
      expiresAt: null,
      tokenType: 'Bearer',
    }, new DateTime())
    const result = auth.check()

    expect(result).toBe(true)
  })

  test('Expect [deleteToken] to do work.', () => {
    const auth = new AuthService(config, windowMock)
    //@ts-ignore
    const nextSpy = jest.spyOn(auth._auth$, 'next')
    // @ts-ignore
    auth._token = new auth._driver({
      accessToken: 'test-token',
      expiresAt: new Date().toUTCString(),
      tokenType: 'Bearer',
    }, new DateTime())
    // @ts-ignore
    auth._user = {}

    auth.deleteToken()

    expect(nextSpy).toHaveBeenCalledTimes(1)
    // @ts-ignore
    expect(auth._token).toBeNull()
    // @ts-ignore
    expect(auth._user).toBeNull()
  })

  test('Expect [getAuthorizationHeader] to do work.', () => {
    const auth = new AuthService(config, windowMock)
    // @ts-ignore
    auth._token = new auth._driver({
      accessToken: 'test-token',
      expiresAt: new Date().toUTCString(),
      tokenType: 'Bearer',
    }, new DateTime())

    const result = auth.getAuthorizationHeader()

    expect(result).toEqual({ 'Authorization': 'Bearer test-token' })
  })

  test('Expect [getAuthorizationHeader] to do work.', () => {
    const auth = new AuthService(config, windowMock)
    // @ts-ignore
    auth._token = new auth._driver({
      accessToken: 'test-token',
      expiresAt: new Date().toUTCString(),
    }, new DateTime())

    const result = auth.getAuthorizationHeader()

    expect(result).toEqual({ 'Authorization': 'test-token' })
  })

  test('Expect [getAuthorizationHeader] to do fail.', () => {
    const auth = new AuthService(config, windowMock)

    const result = auth.getAuthorizationHeader()

    expect(result).toEqual({ 'Authorization': '' })
  })

  test('Expect [getAuthorizationHeader] to do fail.', () => {
    const auth = new AuthService(config, windowMock)

    const result = auth.listen((event: AuthEvent) => {})

    expect(result).toBeInstanceOf(Subscription)
  })


  test('Expect [listen] to return Subscription.', () => {
    const auth = new AuthService(config, windowMock)
    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + (config.refreshThreshold + 1) * 1000);

    auth.setToken({
      accessToken: 'test-token',
      expiresAt: expires.toUTCString(),
      tokenType: 'Bearer',
    })

    // @ts-ignore
    expect(auth._token.token).toEqual({
      accessToken: 'test-token',
      expiresAt: expires.toUTCString(),
      tokenType: 'Bearer',
    })
  })

  test('Expect [setToken] to trigger refresh.', () => {
    const auth = new AuthService(config, windowMock)
    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + (config.refreshThreshold - 500));

    auth.setToken({
      accessToken: 'test-token',
      expiresAt: expires.toUTCString(),
      tokenType: 'Bearer',
    })

    // @ts-ignore
    expect(auth._token.token).toEqual({
      accessToken: 'test-token',
      expiresAt: expires.toUTCString(),
      tokenType: 'Bearer',
    })
  })

  test('Expect [setToken] to use non-refreshable token.', () => {
    const auth = new AuthService(config, windowMock)
    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + (config.refreshThreshold - 500));

    auth.setToken({
      accessToken: 'test-token',
      expiresAt: null,
      tokenType: 'Bearer',
    })

    // @ts-ignore
    expect(auth._token.token).toEqual({
      accessToken: 'test-token',
      expiresAt: null,
      tokenType: 'Bearer',
    })
  })

  test('Expect [setToken] to throw an error (Missing parameter).', () => {
    const auth = new AuthService(config, windowMock)
    let error

    try {
      //@ts-ignore
      auth.setToken({
        expiresAt: null,
        tokenType: 'Bearer',
      })
    } catch (err) {
      error = err
    }

    expect(error).toBeInstanceOf(MissingParameter)
  })

  test('Expect [setUser] to do work.', () => {
    const auth = new AuthService(config, windowMock)
    // @ts-ignore
    auth.setUser({ user: 'test' })

    // @ts-ignore
    expect(auth._user).toBeTruthy()
  })

  test('Expect [get User] to do work.', () => {
    const auth = new AuthService(config, windowMock)
    // @ts-ignore
    auth._user = { user: 'test' }

    const user = auth.user

    // @ts-ignore
    expect(user).toBeTruthy()
  })

  test('Expect [getUserId] to do work.', () => {
    const auth = new AuthService(config, windowMock)
    // @ts-ignore
    auth._user = { user: 'test', id: '1' }

    const user = auth.getUserId()

    // @ts-ignore
    expect(user).toBe('1')
  })

  test('Expect [getUserId] to do return null.', () => {
    const auth = new AuthService(config, windowMock)
    // @ts-ignore
    auth._user = { user: 'test' }

    const user = auth.getUserId()

    // @ts-ignore
    expect(user).toBe(null)
  })

  test('Expect [isTokenValid] to be false.', () => {
    const auth = new AuthService(config, windowMock)
    // @ts-ignore
    const nextSpy = jest.spyOn(auth._auth$, 'next')
    auth.setToken({
      tokenType: 'xxx',
      accessToken: 'test-token',
      expiresAt: new Date().toUTCString(),
    })

    // @ts-ignore
    const result = auth.isTokenValid(auth._token.calculateTokenLifetime())

    expect(result).toBe(false)
    expect(nextSpy).toHaveBeenCalledTimes(3)
  })

  test('Expect [isTokenValid] to be true.', () => {
    const auth = new AuthService(config, windowMock)
    auth.setToken({
      tokenType: 'xxx',
      accessToken: 'test-token',
      expiresAt: new Date('9999').toUTCString(),
    })

    // @ts-ignore
    const result = auth.isTokenValid(auth._token.calculateTokenLifetime())

    expect(result).toBe(true)
  })

  test('Expect [retrieveToken] to be true.', () => {
    const auth = new AuthService(config, windowMock)

    // @ts-ignore
    auth.retrieveToken()

    // @ts-ignore
    expect(auth._token).toEqual(null)
  })

  test('Expect [retrieveToken] to be true.', () => {
    const token = {
      accessToken: 'test-token',
      expiresAt: new Date('9999').toUTCString(),
    }
    window.localStorage.setItem(config.tokenName, JSON.stringify(token))
    const auth = new AuthService(config, windowMock)

    // @ts-ignore
    auth.retrieveToken()


    // @ts-ignore
    expect(auth._token).toEqual(null)
  })

  test('Expect [retrieveToken] to be true.', () => {
    const token = {
      accessToken: 'test-token',
      expiresAt: null
    }
    window.localStorage.setItem(config.tokenName, JSON.stringify(token))
    const auth = new AuthService(config, windowMock)

    // @ts-ignore
    auth.retrieveToken()

    // @ts-ignore
    expect(auth._token).toEqual(null)
  })

  test('Expect [retrieveToken] to be fail.', () => {
    const auth = new AuthService(config, windowMock)
    window.localStorage.getItem = () => {
      throw new Error()
    }

    const deleteSpy = jest.spyOn(auth, 'deleteToken')

    // @ts-ignore
    window.localStorage.setItem(config.tokenName, () => {})
    //
    // @ts-ignore
    auth.retrieveToken()

    expect(deleteSpy).toHaveBeenCalledTimes(1)
  })
})
