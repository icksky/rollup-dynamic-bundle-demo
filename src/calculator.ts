const NAMESPACE = 'Calculater: '

export interface Plugin {
  name: string
  exec(value: number): void
}

export default class Calculater {
  private result = 0

  constructor() {
    console.log(`${NAMESPACE} init.`)
  }

  getResult() {
    return this.result
  }

  setResult(value: number) {
    this.result = value
  }

  add(...args: number[]) {
    this.result = args.reduce((p, c) => p + c, this.result)
  }

  minus(...args: number[]) {
    this.result = args.reduce((p, c) => p - c, this.result)
  }

  static addPlugin({ name, exec }: Plugin) {
    ;(Calculater.prototype as any)[name] = exec
  }
}
