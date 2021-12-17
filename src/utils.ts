import type { EventCenterForMicroApp } from '@micro-zoe/micro-app'
import { CommunicationData, Listener, MicroApp } from './micro-app'

export function runMicroOrBaseFunction<T extends (...args: any[]) => any>(
  app: MicroApp | EventCenterForMicroApp,
  name: string,
  fn: T,
  ...rest: Parameters<T>
) {
  return fn.apply(app, name ? [name, ...rest] : rest)
}

export function runListenerFn(fn: Listener['fn'], data: CommunicationData) {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const result = await fn(data.data)
      data.resolve({
        cmd: data.cmd,
        data: result?.data,
        resolve: (...args: any[]) => {
          resolve()
          result?.resolve && result.resolve(...args)
        },
        reject: (...args: any[]) => {
          reject(...args)
          result?.reject && result.reject(...args)
        },
      })
    } catch (error) {
      data.reject(error)
      throw error
    }
  })
}

export function isString(target: any): target is string {
  return typeof target === 'string'
}
