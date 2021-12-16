<template>
  <section class="tile notification is-primary">
    <article class="tile is-child">
      <div class="content">
        <div class="field">
          <label class="label has-text-white">Email</label>
          <div class="control" :class="{ 'is-loading': loading }">
            <input class="input" v-model="formData.email" type="text" placeholder="Text input" />
          </div>
        </div>
        <div class="field">
          <label class="label has-text-white">Phone</label>
          <div class="control" :class="{ 'is-loading': loading }">
            <input class="input" v-model="formData.phone" type="text" placeholder="Text input" />
          </div>
        </div>
      </div>
    </article>
  </section>
</template>

<script lang="ts">
import { useMicroApp } from '@/index'
import { wait } from 'examples/utils'
import { defineComponent, onUnmounted, ref } from 'vue'

export default defineComponent({
  name: 'App',
  setup() {
    let log: (msg: string | number) => void
    const subApp = useMicroApp({
      onRegistered(data) {
        log = (msg: string | number) => data.get('log')(msg, 'sub app1')
      },
    })
    const formData = ref({
      email: '',
      phone: '',
    })
    const loading = ref(false)

    async function handleSubmit(data: any) {
      log(`✔️ 接收到数据 ${JSON.stringify(data)}`)
      loading.value = true
      let count = 1
      const result = await wait(
        3000,
        {
          ...data,
          ...formData.value,
        },
        () => log('⏲️ ' + count++)
      )
      return {
        data: result,
        resolve: () => {
          log('✔️ 处理完成')
          loading.value = false
          subApp.dispatch('tada', '🎊🎊🎊🎊🎊')
        },
        reject: (error: Error) => {
          log('❌ 处理失败' + error.message)
          loading.value = false
        },
      }
    }

    subApp.addEventListener('submit', handleSubmit)

    onUnmounted(() => {
      subApp.destroy()
    })

    return {
      formData,
      loading,
    }
  },
})
</script>
