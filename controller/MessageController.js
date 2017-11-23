const async = require('async')

const User = require('../models/user')
const Message = require('../models/message')

module.exports = {
  async renderMessage (req, res) {
    const { id } = req.params
    try {
      const resp = await Promise.all([
        User.findById({ '_id': id }),
        Message.find({'$or': [{'userFrom': req.user._id, 'userTo': id}, {'userFrom': id, 'userTo': req.user._id }]})
      ])
      await res.render('messages/message', {
        title: 'Private Message',
        user: req.user,
        data: resp[0],
        chats: resp[1]
      })
    } catch (error) {
      res.status(500).send({
        error
      })
    }
    // async.parallel([
    //   function (callback) {
    //     User.findById({ '_id': id }, (err, data) => {
    //       callback(err, data)
    //     })
    //   },
    //   function (callback) {
    //     Message.find({'$or': [{'userFrom': req.user._id, 'userTo': id}, {'userFrom': id, 'userTo': req.user._id}]}, (err, data2) => {
    //       callback(err, data2)
    //     })
    //   }
    // ], (err, data) => {
    //   const user = data[0]
    //   const msg = data[1]
    //   res.render('messages/message', {
    //     title: 'Private Message',
    //     user: req.user,
    //     data: user,
    //     chats: msg
    //   })
    // })
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
