const passport = require('passport')

module.exports = (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    console.log(user)
    if (!user) {
      res.redirect('/login')
    } else {
      req.user = user
      next()
    }
  })(req, res, next)
}
