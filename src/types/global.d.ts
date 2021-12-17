import type { EventCenterForMicroApp } from '@micro-zoe/micro-app'

declare global {
  declare interface Window {
    // for micro-frontend
    __MICRO_APP_ENVIRONMENT__?: boolean
    __MICRO_APP_BASE_ROUTE__?: string
    __MICRO_APP_PUBLIC_PATH__?: string
    __webpack_public_path__?: string
    microApp?: EventCenterForMicroApp
  }
  // for micro-frontend
  let __webpack_public_path__: string

  declare type Recordable<T = any> = Record<string | number, T>

  declare type Nullable<T> = T | null

  declare type Undefinable<T> = T | undefined

  declare type ValueOf<T> = T[keyof T]

  declare type Functional<T, K = any[]> = T | ((...args: K) => T)

  declare namespace NodeJS {
    interface ProcessEnv {
      PUBLIC_PATH: string
    }
  }
}
