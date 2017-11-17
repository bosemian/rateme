const CompanyController = require('../controller/CompanyController')

module.exports = function (app) {
  app.get('/company/create', CompanyController.renderCreate)

  app.post('/upload', CompanyController.upload)
}
