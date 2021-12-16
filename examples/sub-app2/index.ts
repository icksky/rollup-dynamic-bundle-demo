import { useMicroApp } from '@/index'
import { wait } from 'examples/utils'

let log: (msg: string | number) => void
const subApp = useMicroApp({
  onRegistered(data) {
    log = (msg: string | number) => data.get('log')(msg, 'sub app2')
  },
})

subApp.addEventListener('submit', handleSubmit)

async function handleSubmit(data: any) {
  log('✔️ 接收到数据 ' + JSON.stringify(data))
  let count = 1
  const result = await wait(
    4000,
    {
      ...data,
      hello: 'from sub app2',
    },
    () => log('⏲️ ' + count++)
  )
  log('✔️ 处理完成')

  return {
    data: result,
  }
}

window.addEventListener('unmount', function () {
  subApp.destroy()
})
