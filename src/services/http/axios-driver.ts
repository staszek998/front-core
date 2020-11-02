import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
// import { axios as axiosConfig, common } from '@/config/http'
import { Headers, IResponse, Methods, Payload } from '@/contracts/http'
import { HttpDriver } from '@/services/http/http-driver'

/**
 * Provides axios instance for http calls.
 *
 * @author Łukasz Sitnicki <lukasz.sitnicki@movecloser.pl>
 * @version 1.0.0
 */
export class AxiosDriver extends HttpDriver {
  private instance: AxiosInstance

  constructor (axiosConfig: AxiosRequestConfig, debug: boolean) {
    super(debug)
    this.instance = axios.create(axiosConfig)
  }

  /**
   * Performs http request using axios.
   */
  protected async _call (method: Methods, target: string, data: Payload, headers: Headers, options: any): Promise<IResponse> {
    const responseInstance = await this.instance.request({
      method: method,
      url: target,
      ...AxiosDriver.composePayload(data, method),
      headers: headers,
      responseType: options && options.responseType ? options.responseType : 'json'
    })
      .then((response: AxiosResponse) => {
        return this.composeSuccessResponse(response.status, response.data, response.headers)
      })
      .catch((error: AxiosError) => {
        if (error.hasOwnProperty('response') && typeof error.response !== 'undefined') {
          return this.composeFailResponse(
            error.response.status,
            {},
            error.response.headers,
            error.response.data
          )
        }

        return this.composeFailResponse(0, {}, {}, { message: 'Unexpected request error.' })
      })

    return responseInstance
  }

  /**
   * Constructing payload based on axios requirements.
   */
  private static composePayload (data: Payload, method: Methods) {
    return method === 'get' ? { params: data } : { data: data }
  }
}
