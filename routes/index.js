const express = require('express')

module.exports = function (app) {
  const api = express.Router()
  // routes render page our applicationa
  require('./user')(app)
  app.use('/api', api)
}
