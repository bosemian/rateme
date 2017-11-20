const CompanyController = require('../controller/CompanyController')

module.exports = function (app) {
  app.route('/company/create')
    .get(CompanyController.renderCreate)
    .post(CompanyController.create)

  app.post('/upload', CompanyController.upload)

  app.get('/companies', CompanyController.renderCompanies)
  app.get('/company-profile/:id', CompanyController.renderCompanyProfile)
  app.route('/company/register-employee/:id')
    .get(CompanyController.renderRegisterEmployee)
    .post(CompanyController.registerEomployee)
}
