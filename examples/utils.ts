import { Ref, ref } from 'vue'

export function useLogger(namespace: string, container?: Ref<HTMLDivElement>) {
  const message = ref<string[]>([])

  return {
    log(msg: string | number, prefix = namespace) {
      if (container?.value)
        setTimeout(() => {
          container.value.scrollTo({
            top: container.value.scrollHeight,
          })
        }, 0)
      message.value.push(`${prefix}: ${msg}`)
    },
    message,
  }
}

export function wait(ms: number, result?: any, cb?: Function) {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      cb && cb()
    }, 1000)
    setTimeout(() => {
      clearInterval(interval)
      resolve(result)
    }, ms)
  })
}
