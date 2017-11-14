const User = require('../models/user')
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local').Strategy
const config = require('../config/config')

passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findOne({ _id: id }, '-password')
    done(null, user)
  } catch (error) {
    done(error, false)
  }
})

// check user from token
passport.use(
  new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.authentications.secret
  }, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.id)
      if (!user) {
        return done(new Error(), false)
      }
      // return user
      return done(null, user)
    } catch (err) {
      return done(new Error(), false)
    }
  })
)
// user passport Local strategy
passport.use(
  new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
  },
  async (req, email, password, done) => {
    var messages = []
    try {
      const user = await User.findOne({ email: email })
      if (!user.validPassword(password)) {
        messages.push('Email or Password Does not exist')
        return done(null, false, req.flash('error', messages))
      }
      done(null, user)
    } catch (error) {
      return done(null, false)
    }
  })
)
