import type { EventCenterForMicroApp } from '@micro-zoe/micro-app'
export { setupMicroApp } from './bootstrap'
import { CMD_REGISGER, NAMESPACE } from './constant'
import {
  CommunicationData,
  Listener,
  ListenOptions,
  MicroApp,
  MicroAppOptions,
  MicroAppReturnType,
  PromiseResult,
} from './micro-app'
import { isString, runListenerFn, runMicroOrBaseFunction } from './utils'

const subMicroApp = window.microApp

export function useMicroApp(
  app: MicroApp,
  appName: string,
  options?: MicroAppOptions
): MicroAppReturnType<MicroApp>
export function useMicroApp(options?: MicroAppOptions): MicroAppReturnType<EventCenterForMicroApp>
export function useMicroApp(...params: [MicroAppOptions?] | [MicroApp, string, MicroAppOptions?]) {
  const [app, name, opt] = params as [MicroApp | EventCenterForMicroApp, string?, MicroAppOptions?]
  let microApp: MicroApp | EventCenterForMicroApp = subMicroApp!
  let options: MicroAppOptions = {}
  let appName = ''
  if (isString(name)) {
    microApp = app
    appName = name
    options = opt as MicroAppOptions
  } else {
    options = app as MicroAppOptions
  }
  const { onRegistered } = options || {}
  let listeners = new Map<string, Listener>()
  let cacheData = new Map<string, CommunicationData[]>()
  let registered = new Map<string, any>()

  function addEventListener(eventName: string, fn: Listener['fn'], options?: ListenOptions) {
    const { immediate = false, force = false } = options || {}
    if (listeners.get(eventName)) {
      if (!force) {
        console.warn(
          `${NAMESPACE} will ignore listen ${eventName}, because it already exists and dose not force.`
        )
        return
      }
      console.warn(`${NAMESPACE} will force listen ${eventName}.`)
    }
    const cache = cacheData.get(eventName)
    if (cache) {
      immediate && cache.forEach((item) => runListenerFn(fn, item))
      cacheData.delete(eventName)
    }
    listeners.set(eventName, {
      fn,
    })
  }

  function removeEventListener(name: string) {
    listeners.delete(name)
  }

  function destroy() {
    listeners.clear()
    cacheData.clear()
    registered.clear()
    listeners = null as never
    cacheData = null as never
    registered = null as never
    runMicroOrBaseFunction(microApp, appName, microApp.removeDataListener, microAppListener)
    microApp = null as never
  }

  function microAppListener(data: CommunicationData) {
    const { cmd } = data
    const listener = listeners.get(cmd)
    if (!listener) {
      const cache = cacheData.get(cmd)
      cacheData.set(cmd, cache ? cache.concat(data) : [data])
      return
    }
    runListenerFn(listener.fn, data)
  }

  function dispatch<U>(eventName: string, data: U): Promise<PromiseResult | undefined> {
    return new Promise((resolve, reject) => {
      const message: any = {
        cmd: eventName,
        data,
        resolve,
        reject,
      } as CommunicationData
      // main or sub app
      'setData' in microApp ? microApp.setData(appName, message) : microApp.dispatch(message)
    })
  }

  async function register(data: Recordable) {
    const result = await dispatch(CMD_REGISGER, data)
    result?.resolve()
  }

  runMicroOrBaseFunction(microApp, appName, microApp.addDataListener, microAppListener, true)

  addEventListener(
    CMD_REGISGER,
    (data: Recordable) => {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          registered.set(key, data[key])
        }
      }
      onRegistered && onRegistered(registered)
    },
    { immediate: true }
  )

  return {
    microApp,
    addEventListener,
    removeEventListener,
    destroy,
    dispatch,
    registered,
    register,
  }
}
