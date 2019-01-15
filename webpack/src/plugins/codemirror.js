// https://www.npmjs.com/package/vue-codemirror
// require lib
import Vue from 'vue'
import VueCodemirror from 'vue-codemirror'
// import VueCodemirror from 'vue2-codemirror-lite-js'

// require styles
import 'codemirror/lib/codemirror.css'

// require more codemirror resource...

// you can set default global options and events when use
Vue.use(VueCodemirror /*, {
  options: { theme: 'base16-dark', ... },
  events: ['scroll', ...]
} */)
