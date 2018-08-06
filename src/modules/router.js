import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Pods from '@/components/Pods'
import Codemirror from '@/components/Codemirror'
import Ssh from '@/components/Ssh'

Vue.use(Router)

console.log(Vue.options.components)

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'HelloWorld',
      component: HelloWorld
    },
/*    {
      path: '/kube',
      name: 'Kube',
      component: Kube
    }, */
    {
      path: '/',
      name: 'Pods',
      component: Pods
    },
    {
      path: '/code',
      name: 'Codemirror',
      component: Codemirror
    },
    {
      path: '/ssh',
      name: 'Ssh',
      component: Ssh
    }
  ]
})
