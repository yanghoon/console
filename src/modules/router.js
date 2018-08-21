import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Resources from '@/components/Resources'
import ResourceDetail from '@/components/ResourceDetail'
import Codemirror from '@/components/Codemirror'
import Conf from '@/components/Conf'
import Ssh from '@/components/Ssh'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/conf',
      name: 'Conf',
      component: Conf
    },
    {
      path: '/',
      name: 'Resources',
      component: Resources
    },
    {
      path: '/:resource/:id',
      name: 'ResourceDetail',
      component: ResourceDetail
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
