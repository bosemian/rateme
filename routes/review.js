const ReviewController = require('../controller/ReviewController')

module.exports = (app) => {
  app.route('/review/:id')
    .get(ReviewController.renderReview)
    .post(ReviewController.createReview)
}
