import Vue from 'vue'
import Underscore from 'underscore'
import VueMoment from 'vue-moment'

// https://forum.vuejs.org/t/how-to-create-lodash-in-template-expression-global/17035/4

Vue.prototype.$_ = Underscore
Vue.prototype._ = Underscore
Vue.use(VueMoment)
