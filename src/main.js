// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Axios from 'axios'   // http://vuejs.kr/update/2017/01/04/http-request-with-axios/

import router from './modules/router'
//import bootstrap from './modules/bootstrap'
import vuetify from './modules/vuetify'
import codemirror from './modules/codemirror'
//import xterm from './modules/'

Vue.config.productionTip = false
Vue.prototype.$http = Axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
