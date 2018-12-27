/*
const fs = require('fs')

fs.readdir('.', (err, files) => {
  if (err) {
    console.log('Can not load plugins !!')
  }

  console.error(files)

  files.forEach(file => {
    console.log(file)
  })
})

console.error('!!!')
*/

import Router from './router.js'

export default {
  router: Router
}

// https://www.npmjs.com/package/require-context
const req = require.context('../pages', true, /vue$/)
console.log(req.keys())
