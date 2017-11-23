const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
const async = require('async')

const Company = require('../models/company')
const User = require('../models/user')

const { arrayAverage } = require('../myFunction')

module.exports = {
  async renderCreate (req, res) {
    const success = req.flash('success')
    try {
      await res.render('company/company', {
        title: 'Company Registration',
        user: req.user,
        success: success,
        noErrors: success.length > 0
      })
    } catch (error) {
      res.status(500).send({
        message: 'cannot render company page'
      })
    }
  },

  async create (req, res) {
    var newCompany = new Company()
    newCompany.name = req.body.name
    newCompany.address = req.body.address
    newCompany.city = req.body.city
    newCompany.country = req.body.country
    newCompany.sector = req.body.sector
    newCompany.website = req.body.website
    newCompany.image = req.body.upload ? req.body.upload : ''
    try {
      await newCompany.save()
      req.flash('success', 'Company data has been added.')
      await res.redirect('/company/create')
    } catch (error) {
      res.status(500).send({
        message: 'cannot create a company'
      })
    }
  },

  async upload (req, res) {
    const form = new formidable.IncomingForm()
    form.uploadDir = path.join(__dirname, '../public/uploads')
    form.on('file', async (field, file) => {
      try {
        try {
          await fs.rename(file.path, path.join(form.uploadDir, file.name))
          console.log('File has been rename')
        } catch (error) {
          console.log(error)
          throw error
        }
      } catch (error) {
        console.log(error)
        throw error
      }
    })
    form.on('error', async (err) => {
      await console.log('An error occured', err)
    })
    form.on('end', async () => {
      await console.log('File upload was successful')
    })
    await form.parse(req)
  },

  async renderCompanies (req, res) {
    try {
      const companies = await Company.find({})
      console.log(companies)
      await res.render('company/companies', {
        title: 'All Companies' || 'RateMe',
        user: req.user,
        data: companies
      })
    } catch (error) {
      res.status(500).send({
        message: error
      })
    }
  },

  async renderCompanyProfile (req, res) {
    try {
      const { id } = req.params
      const company = await Company.findOne({ _id: id })
      const avg = arrayAverage(company.ratingNumber)
      await res.render('company/company-profile', {
        title: 'Company Profile' || 'RateMe',
        user: req.user,
        data: company,
        average: avg,
        id
      })
    } catch (error) {
      console.log(error)
    }
  },

  async renderRegisterEmployee (req, res) {
    try {
      const { id } = req.params
      const company = await Company.findOne({ _id: id })
      await res.render('company/register-employee', {
        title: 'Register Employee' || 'RateMe',
        user: req.user,
        data: company,
        id
      })
    } catch (error) {
      console.log(error)
    }
  },

  async registerEomployee (req, res, next) {
    const { id } = req.params
    const { _id, fullname } = req.user
    const role = req.body.role
    async.parallel([
      function (callback) {
        Company.update({
          '_id': id,
          'employees.employeeId': { $ne: _id }
        },
          {
            $push: {
              employees: {
                employeeId: _id,
                employeeFullName: fullname,
                employeeRole: role
              }
            }
          }, (err, count) => {
            if (err) {
              return next(err)
            }
            callback(err, count)
          }
        )
      },
      function (callback) {
        async.waterfall([
          function (callback) {
            Company.findOne({ '_id': id }, (err, data) => {
              if (err) {
                return err
              }
              callback(err, data)
            })
          },
          function (data, callback) {
            User.findOne({ '_id': _id }, (err, result) => {
              if (err) {
                res.status(500).send({
                  message: err
                })
              }
              console.log('result', result)
              console.log('data', data)
              result.role = role
              result.company.name = data.name
              result.company.image = data.image

              result.save((err) => {
                if (err) {
                  res.status(500).send({
                    message: 'cannot save role to user.'
                  })
                }
                res.redirect('/home')
              })
            })
          }
        ])
      }
    ])
  },

  async renderEmployees (req, res) {
    try {
      const { id } = req.params
      const company = await Company.findOne({ '_id': id })
      await res.render('company/employees', {
        title: 'Company Employee',
        user: req.user,
        data: company
      })
    } catch (error) {
      res.status(500).send({
        message: 'cannot render employees page',
        error
      })
    }
  },

  async renderLeaderboard (req, res) {
    try {
      const company = await Company.find({}).sort({'ratingSum': 1})
      await res.render('company/leaderboard', {
        title: 'Companies Leaderboard' || 'RateMe',
        user: req.user,
        data: company
      })
    } catch (error) {
      res.status(500).send({
        message: 'cannot render leaderbord page',
        error
      })
    }
  }

}
