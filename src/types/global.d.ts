import type { Plugin } from '@/calculator'

declare global {
  declare interface Window {
    Calculater: {
      new (): Calculater
      static addPlugin(plugin: Plugin)
    }
  }

  declare type Recordable<T = any> = Record<string | number, T>

  declare type Nullable<T> = T | null

  declare type Undefinable<T> = T | undefined

  declare type ValueOf<T> = T[keyof T]

  declare type Functional<T, K = any[]> = T | ((...args: K) => T)

  declare class Calculater {
    getResult(): number
    setResult(value: number): void
    add(value: number): void
    minus(value: number): void
    multiply?(value: number): void
    divide?(value: number): void
  }

  declare namespace NodeJS {
    interface ProcessEnv {
      PUBLIC_PATH: string
    }
  }
}
