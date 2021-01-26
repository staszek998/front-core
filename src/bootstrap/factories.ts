import { RouterDriver, StoreDriver } from '../contracts/bootstrapper'

import { Container } from '../container'
import { NoneBootstrapper } from './drivers/none-bootstrapper'
import { VueRouterBootstrapper } from './drivers/vue-router-bootstrapper'
import { VuexBootstrapper } from './drivers/vuex-bootstrapper'

/**
 * Decide which of predefined router driver to use.
 */
/* istanbul ignore next */
export const routerFactory = (routerType: RouterDriver, container: Container): any => {
  switch (routerType) {
    case RouterDriver.VueRouter:
      return new VueRouterBootstrapper(container)
    case RouterDriver.None:
      return new NoneBootstrapper()
    default:
      throw new Error(`Unsupported router driver [${routerType}].`)
  }
}

/**
 * Decide which of predefined store driver to use.
 */
/* istanbul ignore next */
export const storeFactory = (storeType: StoreDriver, container: Container ): any => {
  switch (storeType) {
    case StoreDriver.Vuex:
      return new VuexBootstrapper(container)
    case StoreDriver.None:
      return new NoneBootstrapper()
    default:
      throw new Error(`Unsupported store driver [${storeType}].`)
  }
}
