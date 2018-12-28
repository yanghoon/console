import Path from 'path'

// https://www.npmjs.com/package/require-context
const req = require.context('.', true, /js$/)
const plugins = {}
req.keys().forEach(k => {
  var module = req(k)
  var name = module.name || Path.basename(k, '.js')

  /*
   * no defaults is exclude
   * - http://asfirstalways.tistory.com/273
   */
  if (module.default) {
    plugins[name] = module.default
  }
})

export default plugins
