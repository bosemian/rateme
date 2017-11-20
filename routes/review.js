const ReviewController = require('../controller/ReviewController')

module.exports = (app) => {
  app.get('/review/:id', ReviewController.renderReview)
}
