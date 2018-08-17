// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Axios from 'axios'   // http://vuejs.kr/update/2017/01/04/http-request-with-axios/

import router from './modules/router'
//import bootstrap from './modules/bootstrap'
import vuetify from './modules/vuetify'
import codemirror from './modules/codemirror'
//import xterm from './modules/'

import App from './App'
import ssh from '@/components/SshKube'
import log from '@/components/SshLog'

Vue.config.productionTip = false
Vue.prototype.$http = Axios

Vue.component(ssh.name, ssh)  // https://stackoverflow.com/a/44568550
Vue.component(log.name, log)  // https://stackoverflow.com/a/44568550

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
