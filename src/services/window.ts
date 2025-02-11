/* istanbul ignore file */

// TODO: add tests and remove ignore

import { IDocument, IWindow } from '../contracts/services'
import { Injectable } from '../container'

/**
 * Provides window object access and functionalities.
 *
 * @author  Kuba Fogel <kuba.fogel@movecloser.pl>
 * @version 1.0.0
 */
@Injectable()
export class WindowService implements IWindow {
  /**
   * Service that implements IDocument.
   *
   * @var IDocument
   */
  private readonly _document: IDocument

  /**
   * Determine if window object is available (Client vs SSR).
   *
   * @var boolean
   */
  private readonly _isDefined: boolean = false

  /**
   * Indicates whether window tab is focused.
   *
   * @var boolean
   */
  public isActive: boolean = true

  constructor (document: IDocument) {
    this._document = document

    if (WindowService.isDefined) {
      this._isDefined = true
      this.registerTabListeners()
    }
  }

  /**
   * Add listener to document object (if defined)
   *
   * @return void
   */
  public addEventListener (name: any, handler: (this: Window, ev: any) => any, options?: any): void {
    if (this._isDefined) {
      window.addEventListener(name, handler, options)
    }
  }

  /**
   * Call method in parent object based on name.
   *
   * @param {String} method
   * @param {Array} params
   * @return any
   */
  public call (method: string, params: any[]): any {
    if (this._isDefined && Object.prototype.hasOwnProperty.call(window, method)) {
      // @ts-ignore
      return window[method](...params)
    }

    return null
  }

  /**
   * Return IDocument service.
   *
   * @return IDocument
   */
  public get document (): IDocument {
    return this._document
  }

  /**
   * Determine if applications runs in web browser.
   *
   * @return boolean
   */
  public get isClient (): boolean {
    return this._isDefined
  }

  /**
   * Return pathname from window location.
   */
  static get pathname (): string {
    return WindowService.isDefined ? window.location.pathname : '/'
  }

  /**
   * Return native window object or null
   *
   * @return window | null
   */
  public get native (): Window | null {
    return this._isDefined ? window : null
  }

  /**
   * Determine if global window object is defined.
   *
   * @return boolean
   */
  static get isDefined (): boolean {
    return typeof window !== 'undefined'
  }

  /**
   * Determines whether the website is being viewed on the tablet screen.
   *
   * @return boolean
   */
  public get isDesktop (): boolean {
    if (this._isDefined) {
      return window.innerWidth >= 992
    }
    return false
  }

  /**
   * Determine if applications at mobile device
   *
   * @return boolean
   */
  public get isMobile (): boolean {
    if (this._isDefined) {
      return window.innerWidth <= 768
    }
    return false
  }

  /**
   * Determines whether the website is being viewed on the phone screen.
   *
   * @return boolean
   */
  public get isPhone (): boolean {
    if (this._isDefined) {
      return window.innerWidth < 768
    }
    return false
  }

  /**
   * Determine if applications runs at server.
   *
   * @return boolean
   */
  public get isServer (): boolean {
    return !this._isDefined
  }

  /**
   * Determines whether the website is being viewed on the tablet screen.
   *
   * @return boolean
   */
  public get isTablet (): boolean {
    if (this._isDefined) {
      return window.innerWidth >= 768 && window.innerWidth < 992
    }
    return false
  }

  /**
   * Redirects to given url
   *
   * @return void
   */
  public redirect (target: string): void {
    if (this.isClient) {
      window.location.href = target
    }
  }

  /**
   * Register window focus/blur listeners.
   * @private
   */
  private registerTabListeners (): void {
    window.addEventListener('focus', () => {
      this.isActive = true;
    });

    window.addEventListener('blur', () => {
      this.isActive = false;
    });
  }

  /**
   *
   * @param callback
   */
  public onFocus (callback: () => void): void {
    window.addEventListener('focus', () => {
      callback()
    });
  }

  /**
   * Removes listener from document object (if defined)
   *
   * @return void
   */
  public removeEventListener (name: any, handler: (this: Window, ev: any) => any, options?: any): void {
    if (this._isDefined) {
      window.removeEventListener(name, handler, options)
    }
  }

  public scrollTo (options: ScrollToOptions | number | undefined, y?: number): void {
    if (this._isDefined) {
      if (typeof options !== 'undefined') {
        if (typeof y === 'number') {
          window.scrollTo(options as number, y)
        } else {
          window.scrollTo(options as ScrollToOptions)
        }
      }
    }
  }
}
