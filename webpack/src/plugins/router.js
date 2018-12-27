import Vue from 'vue'
import PageRouter from 'vue-page-router'
import * as pages from '../pages'

// https://www.npmjs.com/package/require-context
// const root = '../pages'
const req = require.context('../pages', true, /vue$/)
const pages2 = []
req.keys().forEach(k => {
  // https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/replace
  // '/user/_id'   -> '/user/:id'
  // '/user/index' -> '/user'
  // '/index' -> '/'

  var path = k.replace(/\.(.+)\.vue/, (m, g) => g)
  path = path.replace(/_/, ':')
  path = path.replace(/\/index$/, '')
  path = path || '/'

  var comp = req(k).default
  comp.path = path

  pages2.push(comp)
})

console.log('pages :: ', pages)
console.log('pages2 :: ', pages2)

export default PageRouter.install(Vue, pages2)
