function convert (route) {
  var comp = route.component
  if (comp.layout) {
    route.meta = { layout: comp.layout }
    // Router.addRoutes([route])
  }
}

// http://www.daleseo.com/js-module-import/
export { convert }
