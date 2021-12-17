import type { BootstrapOptions, MicroApp } from './micro-app'

export function setupMicroApp(microApp: MicroApp, options?: BootstrapOptions, tagName?: string) {
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
  if (!window.__MICRO_APP_ENVIRONMENT__ || tagName?.startsWith('micro-app-')) {
    microApp.start({ tagName })
  }
}
