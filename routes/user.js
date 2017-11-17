const passport = require('passport')
const AuthController = require('../controller/AuthController')
const UserController = require('../controller/UserController')
const forgot = require('./forgot')
const reset = require('./reset')

const requireAuth = require('../policies/IsAuthenticated')

module.exports = function (app) {
  app.get('/', UserController.renderIndex)
  app.get('/home', requireAuth, UserController.renderHome)
  // routes
  app.route('/signup')
    .get(UserController.renderSignup)
    .post(validate, AuthController.signup)
  app.route('/login')
    .get(UserController.renderLogin)
    .post(passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: true
    }), authen)
  app.route('/forgot')
    .get(UserController.renderForgot)
    .post(forgot)
  app.route('/reset/:token')
    .get(UserController.renderReset)
    .post(reset)
  app.get('/logout', AuthController.logout)
}

function validate (req, res, next) {
  req.checkBody('fullname', 'Fullname is Required !').notEmpty()
  req.checkBody('fullname', 'Fullname must not be less than 5 !').isLength({ min: 5 })
  req.checkBody('email', 'Email is Required !').notEmpty()
  req.checkBody('email', 'Email is Invalid !').isEmail()
  req.checkBody('password', 'Password is Required !').notEmpty()
  req.checkBody('password', 'Password must not be less than 5 !').isLength({ min: 5 })
  // req.check('password', 'Password must contain at least 1 number.').matches(/^(?=.*\d)(?=.*[a-z])[0-9a-z]{5,}$/, 'i')
  req.getValidationResult()
  .then((result) => {
    if (result.array().length > 0) {
      console.log('error')
      var messages = []
      result.array().forEach((error) => {
        messages.push(error.msg)
      })
      req.flash('error', messages)
      res.redirect('/signup')
    } else {
      return next()
    }
  })
}

function authen (req, res) {
  if (req.body.rememberme) {
    req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000 // 30 days
  } else {
    req.session.cookie.expires = null
  }
  return res.redirect('/home')
}
