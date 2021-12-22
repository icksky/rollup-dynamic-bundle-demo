import Calculater from '../calculator'

Calculater.addPlugin({
  name: 'divide',
  exec(val: number) {
    const _this = this as unknown as Calculater
    _this.setResult(_this.getResult() / val)
  },
})
