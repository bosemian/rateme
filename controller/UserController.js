module.exports = {
  async index (req, res) {
    try {
      await res.render('index', {
        title: 'Index' || 'RateMe'
      })
    } catch (error) {
      res.status(500).send({
        message: 'error does not render index page'
      })
    }
  },

  async home (req, res) {
    try {
      await res.render('home', {
        title: 'Home' || 'Rate Me'
      })
    } catch (error) {
      res.status(500).send({
        message: 'error does not render home page'
      })
    }
  },

  async signup (req, res) {
    const error = req.flash('error')
    try {
      await res.render('user/signup', {
        title: 'Sign Up' || 'RateMe',
        message: error,
        hasError: error.length > 0
      })
    } catch (error) {
      res.status(500).send({
        message: 'error does not render signup page'
      })
    }
  },

  async login (req, res) {
    const error = req.flash('error')
    try {
      await res.render('user/login', {
        title: 'Login' || 'RateMe',
        message: error,
        hasError: error.length > 0
      })
    } catch (error) {
      res.status(500).send({
        message: 'error does not render login page'
      })
    }
  },

  async forgot (req, res) {
    const error = req.flash('error')
    const info = req.flash('info')
    try {
      await res.render('user/forgot', {
        title: 'Request Password Reset',
        info,
        noErrors: info.length > 0,
        messages: error,
        hasErrors: error.length > 0
      })
    } catch (error) {
      res.status(500).send({
        message: 'error does not render forgot page'
      })
    }
  }
}
