import type { EventCenterForBaseApp } from '@micro-zoe/micro-app/interact'

export interface MicroAppOptions {
  onRegistered?: (data: Map<string, any>) => void
}

export interface MicroAppReturnType<T extends EventCenterForBaseApp | EventCenterForMicroApp> {
  microApp: T
  addEventListener: (
    eventName: string,
    fn: Listener['fn'],
    options?: ListenOptions | undefined
  ) => void
  removeEventListener: (name: string) => void
  destroy: () => void
  dispatch: <U>(eventName: string, data?: U) => Promise<PromiseResult | undefined>
  registered: Map<string, any>
  register: (data: Recordable) => Promise<void>
}

export interface CommunicationData extends PromiseResult<T> {
  cmd: string
  data?: T
}

export interface PromiseResult<T = any> {
  resolve?: ReturnType<PromiseConstructor>[0]
  reject?: ReturnType<PromiseConstructor>[1]
  data?: T
}

export interface ListenOptions {
  immediate?: boolean
  force?: boolean // whether cover old listener
}

export interface Listener {
  fn: (...args: any[]) => Promise<PromiseResult | void> | PromiseResult | void
}

export interface BootstrapOptions {
  mounted: () => void
  unmount: () => void
}
