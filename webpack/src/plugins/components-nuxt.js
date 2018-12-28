import Vue from 'vue'

// ref: vue lifecycle (https://blog.martinwork.co.kr/vuejs/2018/02/05/vue-lifecycle-hooks.html)
export default function () {
  const RouterView = Vue.component('RouterView')
  const RouterLink = Vue.component('RouterLink')
  Vue.component('nuxt', RouterView)
  Vue.component('nuxt-link', RouterLink)
}

const name = 'beforeCreate'
export { name }
