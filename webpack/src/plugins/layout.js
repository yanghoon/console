let config = {
  layout: {
    // default: 'default2'
  }
}
function convert (route) {
  var comp = route.component
  if (comp.layout) {
    route.meta = { layout: comp.layout }
    // Router.addRoutes([route])
  } else if (config.layout.default) {
    route.meta = { layout: config.layout.default }
  }
}

// http://www.daleseo.com/js-module-import/
export { convert }
