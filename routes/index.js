const express = require('express')
const nodemailer = require('nodemailer')
const SMTPTransport = require('nodemailer-smtp-transport')
const async = require('async')
const crypto = require('crypto')

const secret = require('../secret')
const User = require('../models/user')
const AuthController = require('../controller/AuthController')
const UserController = require('../controller/UserController')
const requireAuth = require('../policies/IsAuthenticated')

module.exports = function (app) {
  const api = express.Router()
  // routes render page our applicationa
  app.get('/', UserController.index)
  app.get('/home', UserController.home)
  app.get('/forgot', UserController.forgot)
  // routes
  app.get('/signup', UserController.signup)
  app.get('/login', UserController.login)
  app.post('/signup', validate, AuthController.signup)
  app.post('/login', loginValidate, AuthController.login)
  app.post('/forgot', (req, res, next) => {
    async.waterfall([
      function (callback) {
        crypto.randomBytes(20, (err, buf) => {
          const rand = buf.toString('hex')
          callback(err, rand)
        })
      },
      function (rand, callback) {
        User.findOne({ email: req.body.email }, (err, user) => {
          if (!user) {
            req.flash('error', 'No Account With That Exist Or Email Invalid')
            return res.redirect('/forgot')
          }
          user.passwordResetToken = rand
          user.passwordResetExpires = Date.now() + 60 * 60 * 1000
          user.save((err) => {
            callback(err, rand, user)
          })
        })
      },
      function (rand, user, callback) {
        const smtpTransport = nodemailer.createTransport(SMTPTransport({
          service: 'gmail',
          secure: false,
          port: 25,
          auth: {
            user: secret.auth.user,
            pass: secret.auth.pass
          }
        }))
        const mailOptions = {
          to: secret.auth.user,
          from: 'RateMe <test@test.com>',
          subject: 'RateMe Application Password Reset Token',
          text: `You have requested for pssword reset token.
                Please click on the link to complete process:
                http://localhost:4200/reset/${rand}`
        }
        smtpTransport.sendMail(mailOptions, (err, response) => {
          req.flash('info', 'A password reset token has be sent to siwanon.turbow@gmail.com')
          return callback(err, user)
        })
      }
    ], (err) => {
      if (err) { return next(err) }
      res.redirect('/forgot')
    })
  })

  api.get('/test', (req, res) => {
    res.render('test')
  })
  app.use('/api', api)
}

function validate (req, res, next) {
  req.checkBody('fullname', 'Fullname is Required !').notEmpty()
  req.checkBody('fullname', 'Fullname must not be less than 5 !').isLength({ min: 5 })
  req.checkBody('email', 'Email is Required !').notEmpty()
  req.checkBody('email', 'Email is Invalid !').isEmail()
  req.checkBody('password', 'Password is Required !').notEmpty()
  req.checkBody('password', 'Password must not be less than 5 !').isLength({ min: 5 })
  // req.check('password', 'Password must contain at least 1 number.').matches(/^(?=.*\d)(?=.*[a-z])[0-9a-z]{5,}$/, 'i')

  var errors = req.validationErrors()
  if (errors) {
    var messages = []
    errors.forEach((error) => {
      messages.push(error.msg)
    })

    req.flash('error', messages)
    res.redirect('/signup')
  } else {
    return next()
  }
}

function loginValidate (req, res, next) {
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
        res.redirect('/login')
      } else {
        return next()
      }
    })
}
