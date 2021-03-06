const nodemailer = require('nodemailer')
const SMTPTransport = require('nodemailer-smtp-transport')
const async = require('async')
const crypto = require('crypto')

const secret = require('../secret')
const User = require('../models/user')

module.exports = (req, res, next) => {
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
}
