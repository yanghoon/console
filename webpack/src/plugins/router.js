import Vue from 'vue'
import Path from 'path'
import * as Layout from './layout'

/** START from vue-page-router */
// import PageRouter from 'vue-page-router'
import Router from 'vue-router'
import kebabCase from 'lodash/kebabCase'
import camelCase from 'lodash/camelCase'

function makeOptions (pages) {
  let options = { mode: 'history', routes: [] }

  for (let [pageName, component] of Object.entries(pages)) {
    let name = camelCase(pageName)
    let slug = kebabCase(pageName)
    let path = component.path ? component.path : name === 'index' ? '/' : '/' + slug

    options.routes.push({ path, component, name: pageName })
  }

  return options
}
/** END from vue-page-router */

/** Load page components and generate route path */
function loadPages () {
  // https://www.npmjs.com/package/require-context
  const req = require.context('../pages', true, /vue$/)
  return req.keys().map(k => {
    // '/user/_id'   -> '/user/:id'
    // '/user/index' -> '/user'
    // '/index' -> '/'

    var comp = req(k).default
    var dir = Path.dirname(k)
    var name = Path.basename(k, Path.extname(k))
    var path = ['/', dir, (name !== 'index' ? name : '')]
    comp.path = Path.join(...path).replace('_', ':')

    console.log(k, '->', comp.path, comp)

    return comp
  })
}

/** Error handlers */
function _404 (to, from, next, error) {
  if (to.path === '/error') {
    to.params.error = { statusCode: 404 }
  }

  if (!to.matched.length) {
    return next('/error')
  }

  next()
}

/** Make routes */
let pages = loadPages()
let options = makeOptions(pages)

options.routes.forEach(Layout.convert)
options.routes.push({
  path: '/error',
  name: 'error',
  props: true, // https://router.vuejs.org/guide/essentials/passing-props.html#passing-props-to-route-components
  component: require('../layouts/error').default
})

/** Create VueRouter for exporting */
function makeRouter () {
  Vue.use(Router)
  let router = new Router(options)

  router.beforeEach(_404)

  return router
}

export default makeRouter()

// export default PageRouter.install(Vue, pages)
// export { pages }
