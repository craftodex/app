var Path = require('path')
var Url = require('url')
var express = require('express')
var config = require('config')

var isProd = require('util/isProd')
var isDev = require('util/isDev')

var app = express()

// api
app.use(config.api.url.pathname, require('api-service')(config))

// js
app.use(require('bundle-service')({
  entries: [Path.join(__dirname, 'client.js')],
  debug: isDev,
  cacheLength: isProd ? 'days' : undefined,
  cacheFile: Path.join(__dirname, 'assets', '.bundle.json')
}))

// less
app.use(require('less-service')(config))

// assets
app.use(require('assets-service')(config))

// html
app.use(config.ui.url.pathname, require('ui-service')(config))

// start server
app.listen(config.url.port, function () {
  var url = config.url
  url.port = undefined
  console.log('Holodex is running at: ' + Url.format(url) + '.')
})
