const MessageController = require('../controller/MessageController')

module.exports = (app) => {
  app.route('/message/:id')
    .get(MessageController.renderMessage)
    .post(MessageController.newMessage)
}
