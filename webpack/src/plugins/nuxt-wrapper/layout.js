import store from '@/store'
const {config} = store.state

function convert (route) {
  var comp = route.component
  if (comp.layout) {
    route.meta = { layout: comp.layout }
    // Router.addRoutes([route])
  // } else if (config.layout.default) {
  } else if (config.layout) {
    route.meta = { layout: config.layout }
  }
}

// http://www.daleseo.com/js-module-import/
export { convert }
