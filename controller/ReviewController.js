const Company = require('../models/company')

module.exports = {
  async renderReview (req, res) {
    try {
      const { id } = req.params
      const company = await Company.findOne({ '_id': id })
      await res.render('company/review', {
        title: 'Company Review' || 'RateMe',
        data: company,
        user: req.user,
        hasMsg: null
      })
    } catch (error) {
      res.status(500).send({
        message: `cannot render Review Page because ${error}`
      })
    }
  }
}
