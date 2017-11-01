const User = require('../models/user')

module.exports = {
  async users (req, res) {
    try {
      const users = await User.find()
      res.status(200).json(users)
    } catch (error) {
      console.log(error)
      res.status(500).send({
        error: 'an error find users!'
      })
    }
  }
}
