import type { default as microApp, EventCenterForMicroApp } from '@micro-zoe/micro-app'

export type MicroApp = typeof microApp

export interface MicroAppOptions {
  onRegistered?: (data: Map<string, any>) => void
}

export interface MicroAppReturnType<T extends MicroApp | EventCenterForMicroApp> {
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
  register: (data: Record<string, any>) => Promise<void>
}

export interface CommunicationData<T = any> extends PromiseResult<T> {
  cmd: string
  data?: T
}

export interface PromiseResult<T = any> {
  resolve<T>(...args: any[]): Promise<T> | void
  reject<T = never>(reason?: any): Promise<T> | void
  data?: T
}

export interface ListenOptions {
  immediate?: boolean
  force?: boolean // whether cover old listener
}

export interface Listener {
  fn: (...args: any[]) => Promise<Partial<PromiseResult> | void> | Partial<PromiseResult> | void
}

export interface SubAppBootstrapOptions {
  mounted?: () => void
  unmount?: () => void
}

export function setupMicroApp(microApp: MicroApp, tagName?: string): void

export function setupMicroSubApp(options?: SubAppBootstrapOptions): void

export function useMicroApp(
  app: MicroApp,
  appName: string,
  options?: MicroAppOptions
): MicroAppReturnType<MicroApp>

export function useMicroApp(options?: MicroAppOptions): MicroAppReturnType<EventCenterForMicroApp>
