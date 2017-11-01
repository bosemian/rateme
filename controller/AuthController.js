const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../config')

module.exports = {
  async setup (req, res) {
    try {
      const nick = await new User({
        email: 'test@email.com',
        password: 'password'
      })
      const user = await nick.save()
      console.log('User saved successfully')
      res.status(201).json(user)
    } catch (error) {
      console.log(error)
      res.status(500).send({
        error: 'setup user has failed! :('
      })
    }
  },

  async authenticate (req, res) {
    try {
      const user = await User.findOne({ email: req.body.email })
      if (!user) {
        res.status(403).json({ success: false, message: 'Authentication failed. User not found.' })
      } else if (user) {
        if (user.password != req.body.password) {
          res.json({ success: false, message: 'Authentication failed. Wrong password.' })
        } else {
          // if user is found and password is right
          // create a token with only our given payload
          // we don't want to pass in the entire user since that has the password
          const payload = {
            email: user.email
          }
          var token = jwt.sign(payload, config.authentications.secret, {
            expiresIn: 1440 // expires in 24 hours
          })

          // return the information including token as JSON
          res.json({
            email: user.email,
            token: token
          })
        }
      }
    } catch (error) {
      console.log(error)
      res.status(500).send({
        message: 'authenticate has failed!'
      })
    }
  }
}
