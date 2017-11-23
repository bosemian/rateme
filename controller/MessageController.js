const User = require('../models/user')
const Message = require('../models/message')

module.exports = {
  async renderMessage (req, res) {
    try {
      const { id } = req.params
      const user = await User.findById({ '_id': id })
      await res.render('messages/message', {
        title: 'Private Message',
        user: req.user,
        data: user,
        chat: null
      })
    } catch (error) {
      res.status(500).send({
        message: 'cannot render message page',
        error
      })
    }
  },

  async newMessage (req, res) {
    try {
      const { id } = req.params
      const { message } = req.body
      const user = await User.findOne({ '_id': id })
      const newMessage = new Message()
      newMessage.userFrom = id
      newMessage.userTo = id
      newMessage.userFromName = req.user.fullname
      newMessage.userToName = user.fullname
      newMessage.body = message
      newMessage.createdAt = new Date()
      const msg = await newMessage.save()
      if (!msg) {
        res.status(500).send({
          message: 'cannot create a new message'
        })
        return
      }
      await res.redirect(`/message/${id}`)
    } catch (error) {
      res.status(500).send({
        error
      })
    }
  }
}
