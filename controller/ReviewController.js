const Company = require('../models/company')
const async = require('async')

module.exports = {
  async renderReview (req, res) {
    try {
      const message = req.flash('success')
      const { id } = req.params
      const company = await Company.findOne({ '_id': id })
      await res.render('company/review', {
        title: 'Company Review' || 'RateMe',
        data: company,
        user: req.user,
        msg: message,
        hasMsg: message.length > 0
      })
    } catch (error) {
      res.status(500).send({
        message: `cannot render Review Page because ${error}`
      })
    }
  },

  async createReview (req, res) {
    try {
      const { id } = req.params
      const { sender, clickedValue, review } = req.body
      const { fullname, role, company: { image } } = req.user
      await async.waterfall([
        function (callback) {
          Company.findOne({ '_id': id }, (err, data) => {
            callback(err, data)
          })
        },

        function (result, callback) {
          Company.update({
            '_id': id
          }, {
            $push: {
              companyRating: {
                companyName: sender,
                userFullname: fullname,
                userRole: role,
                companyImage: image,
                userRating: clickedValue,
                userReview: review
              },
              ratingNumber: clickedValue
            },
            $inc: {
              ratingSum: clickedValue
            }
          }, (err) => {
            req.flash('success', 'Your review has been added.')
            res.redirect(`/review/${id}`)
          })
        }
      ])
    } catch (error) {
      res.status(500).send({
        message: `cannot create review because ${error}`
      })
    }
  }
}
