const express = require('express')
const AuthController = require('../controller/AuthController')
const UserController = require('../controller/UserController')

module.exports = function (app) {
  const api = express.Router()
  api.get('/users', UserController.users)

  api.post('/authenticate', AuthController.authenticate)
  api.get('/setup', AuthController.setup)

  api.get('/test', (req, res) => {
    res.render('test')
  })
  app.use('/api', api)
}
