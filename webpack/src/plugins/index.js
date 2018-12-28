import Path from 'path'

// https://www.npmjs.com/package/require-context
const req = require.context('.', true, /js$/)
const plugins = {}
req.keys().forEach(k => {
  var name = Path.basename(k, '.js')
  var module = req(k).default

  // no defaults is exclude
  if (module) {
    plugins[name] = module
  }
})

export default plugins
