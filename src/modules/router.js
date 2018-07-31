import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Kube from '@/components/Kube'
import KubeVuetify from '@/components/KubeVuetify'
import Codemirror from '@/components/Codemirror'

Vue.use(Router)

console.log(Vue.options.components)

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/kube',
      name: 'Kube',
      component: Kube
    },
    {
      path: '/',
      name: 'KubeVuetify',
      component: KubeVuetify
    },
    {
      path: '/code',
      name: 'Codemirror',
      component: Codemirror
    }
  ]
})
