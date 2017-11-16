module.exports = {
  async renderCreate (req, res) {
    try {
      await res.render('company/company', {
        title: 'Company Registration',
        user: req.user
      })
    } catch (error) {
      res.status(500).send({
        message: 'cannot render company page'
      })
    }
  }
}
