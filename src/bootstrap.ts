import { NAMESPACE } from './constant'
import type { MicroApp, SubAppBootstrapOptions } from './micro-app'

export function setupMicroApp(microApp: MicroApp, tagName?: string) {
  if (window.__MICRO_APP_ENVIRONMENT__ && !tagName?.startsWith('micro-app-')) {
    console.warn(`${NAMESPACE} nested micro app must be named start with "micro-app-".`)
    return
  }
  microApp.start({ tagName })
}

export function setupMicroSubApp(options?: SubAppBootstrapOptions) {
  if (window.__MICRO_APP_ENVIRONMENT__) {
    __webpack_public_path__ = window.__MICRO_APP_PUBLIC_PATH__ || process.env.PUBLIC_PATH

    options?.mounted &&
      window.addEventListener('mounted', function () {
        options.mounted!()
      })

    options?.unmount &&
      window.addEventListener('unmount', function () {
        options.unmount!()
      })
  }
}
