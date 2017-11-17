const CompanyController = require('../controller/CompanyController')

module.exports = function (app) {
  app.route('/company/create')
    .get(CompanyController.renderCreate)
    .post(CompanyController.create)

  app.post('/upload', CompanyController.upload)
}
