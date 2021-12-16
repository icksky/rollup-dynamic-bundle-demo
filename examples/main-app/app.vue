<template>
  <div class="p-4">
    <div class="tile notification is-info">
      <div class="tile is-parent">
        <article class="tile is-child">
          <p class="title"> 应用间通信 </p>
          <section class="content">
            <div class="field">
              <label class="label has-text-white">Name</label>
              <div class="control">
                <input class="input" v-model="formData.name" type="text" placeholder="Text input" />
              </div>
            </div>

            <div class="field">
              <label class="label has-text-white">Message</label>
              <div class="control">
                <textarea
                  class="textarea"
                  v-model="formData.message"
                  placeholder="Textarea"
                ></textarea>
              </div>
            </div>

            <micro-app
              class="mb-4"
              name="app1"
              url="http://localhost:8081"
              @mounted="() => log('sub app1 mounted')"
            />

            <div class="field">
              <div class="control">
                <label class="checkbox">
                  <input type="checkbox" v-model="formData.agreement" /> I agree to the terms and
                  conditions
                </label>
              </div>
            </div>

            <div class="field is-grouped">
              <div class="control">
                <button class="button is-link" @click="submit">Submit</button>
              </div>
              <div class="control">
                <button class="button is-link is-light">Cancel</button>
              </div>
            </div>

            <micro-app
              name="app2"
              url="http://localhost:8082"
              @mounted="() => log('sub app2 mounted')"
            />
          </section>
        </article>
      </div>
      <div class="tile is-parent is-8">
        <article class="tile is-child">
          <p class="title">日志</p>
          <div class="content">
            <section ref="logsRef" class="logs">
              <div class="mb-1" v-for="(msg, index) in message" :key="index">{{ msg }}</div>
            </section>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useMicroApp } from '@/index'
import microApp from '@micro-zoe/micro-app'
import { useLogger } from 'examples/utils'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'App',
  setup() {
    const app = useMicroApp(microApp, 'app1')
    const app2 = useMicroApp(microApp, 'app2')
    const logsRef = ref()
    const { log, message } = useLogger('main app', logsRef)
    const formData = ref({
      name: '',
      message: '',
      agreement: false,
    })

    async function submit() {
      log('🎉 开始提交')
      const result = await app.dispatch('submit', formData.value)
      log('👇 转交 APP2 处理')
      await app2.dispatch('submit', result?.data)
      if (result?.data?.agreement) {
        log('✔️ 提交完成')
        result?.resolve()
      } else {
        log('❌ 提交错误')
        result?.reject(new Error('未勾选同意条款'))
      }
    }

    // 注册 log 方法给子应用
    app.register({
      log,
    })

    // 注册 log 方法给子应用
    app2.register({
      log,
    })

    app.addEventListener('tada', log)

    return {
      submit,
      message,
      formData,
      logsRef,
      log,
    }
  },
})
</script>
