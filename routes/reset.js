const nodemailer = require('nodemailer')
const SMTPTransport = require('nodemailer-smtp-transport')
const async = require('async')

const secret = require('../secret')
const User = require('../models/user')

module.exports = (req, res, next) => {
  async.waterfall([
    function (callback) {
      User.findOne({
        passwordResetToken: req.params.token,
        passwordResetExpires: { $gt: Date.now() }
      }, (err, user) => {
        if (!user) {
          req.flash('error', 'Password reset token has Expired or invalid')
          return res.redirect('/forgot')
        }
        req.checkBody('password', 'Password is Required !').notEmpty()
        req.checkBody('password', 'Password must not be less than 5 !').isLength({ min: 5 })
        req.getValidationResult()
          .then((result) => {
            if (req.body.password === req.body.cpassword) {
              if (result.array() > 0) {
                var messages = []
                result.array().forEach((error) => {
                  messages.push(error.msg)
                })
                req.flash('error', messages)
                return res.redirect(`/reset/${req.params.token}`)
              }
              user.password = req.body.password
              user.passwordResetToken = undefined
              user.passwordResetExpires = undefined
              user.save((err) => {
                if (err) {
                  req.flash('error', 'Your password has not updated')
                  return
                }
                req.flash('success', 'Your password has been successfully updated')
                callback(err, user)
              })
            } else {
              req.flash('error', 'Password and confirm password are not equal.')
              return res.redirect(`/reset/${req.params.token}`)
            }
          })
      })
    },
    function (user, callback) {
      const smtpTransport = nodemailer.createTransport(SMTPTransport({
        service: 'gmail',
        // secure: false,
        // port: 25,
        auth: {
          user: secret.auth.user,
          pass: secret.auth.pass
        }
      }))
      const mailOptions = {
        to: secret.auth.user,
        from: 'RateMe <test@test.com>',
        subject: 'Your password has been updated',
        text: `This is a confirmation that you updated the password for
          ${user.email}`
      }
      smtpTransport.sendMail(mailOptions, (err, response) => {
        callback(err, user)
        const error = req.flash('error')
        const success = req.flash('success')
        res.render('user/reset', {
          title: 'Reset Your Password',
          messages: error,
          hasErrors: error.length > 0,
          noErrors: success.length > 0,
          success
        })
      })
    }
  ])
}
