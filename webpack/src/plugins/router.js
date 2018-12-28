import Vue from 'vue'
import PageRouter from 'vue-page-router'
import Path from 'path'

// https://www.npmjs.com/package/require-context
// const root = '../pages'
const req = require.context('../pages', true, /vue$/)
const pages = req.keys().map(k => {
  // https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/replace
  // '/user/_id'   -> '/user/:id'
  // '/user/index' -> '/user'
  // '/index' -> '/'

  var comp = req(k).default
  var dir = Path.dirname(k)
  var name = Path.basename(k, Path.extname(k))
  var path = ['/', dir, (name !== 'index' ? name : '')]
  comp.path = Path.join(...path).replace('_', ':')

  console.debug(k, '->', comp.path)

  return comp
})

export default PageRouter.install(Vue, pages)
