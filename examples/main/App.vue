<template>
  <section class="hero is-primary">
    <div class="hero-body">
      <p class="title"> APP </p>
      <p class="subtitle"> Number first, Operator then </p>
      <section>
        <div class="field is-grouped">
          <div class="control">
            <button class="button is-primary is-light" @click="add">+</button>
          </div>
          <div class="control">
            <button class="button is-link is-light" @click="minus">-</button>
          </div>
          <div class="control">
            <button class="button is-link is-light" @click="multiply">×</button>
          </div>
          <div class="control">
            <button class="button is-link is-light" @click="divide">÷</button>
          </div>
        </div>
        <section style="width: 200px">
          <div class="columns is-multiline">
            <div class="column is-4 has-text-centered" v-for="index in 9" :key="index">
              <button class="button is-link is-light" @click="setValue(index)">{{ index }}</button>
            </div>
          </div>
        </section>
        <div class="is-size-4">{{ value || '-' }}</div>
        <div class="is-size-3"> ={{ result }}</div>
      </section>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'App',
  setup() {
    let calc: Calculater
    const result = ref(0)
    const value = ref('')

    function init() {
      calc = new window.Calculater()
    }

    function update() {
      result.value = calc.getResult()
      value.value = ''
    }

    function add() {
      if (!value.value) return
      calc.add(Number(value.value))
      update()
    }

    function minus() {
      if (!value.value) return
      calc.minus(Number(value.value))
      update()
    }

    function multiply() {
      if (!calc.multiply) {
        console.warn('not support')
        return
      }
      if (!value.value) return
      calc.multiply(Number(value.value))
      update()
    }

    function divide() {
      if (!calc.divide) {
        console.warn('not support')
        return
      }
      if (!value.value) return
      calc.divide(Number(value.value))
      update()
    }

    function setValue(val: number) {
      value.value += String(val)
    }

    setTimeout(() => {
      init()
    }, 500)

    return {
      add,
      minus,
      result,
      multiply,
      divide,
      setValue,
      value,
    }
  },
})
</script>

<style lang="scss" scoped></style>
