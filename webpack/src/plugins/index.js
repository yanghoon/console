import Path from 'path'

// https://www.npmjs.com/package/require-context
const req = require.context('.', true, /js$/)
const plugins = {}
req.keys().forEach(k => {
  var name = Path.basename(k, '.js')
  plugins[name] = req(k).default
})

export default plugins
