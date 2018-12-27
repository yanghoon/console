// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import plugins from './plugins'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  ...plugins /*
    {
      'router': VueRouter  #CONST_KEY (https://router.vuejs.org/kr/guide/#javascript)
    }
  */
})
