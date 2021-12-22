export { default } from './calculator'

if (process.env.MODULE_MULTIPLY) import('./plugins/multiply')
if (process.env.MODULE_DIVIDE) import('./plugins/divide')
