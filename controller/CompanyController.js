const formidable = require('formidable')
const path = require('path')
const fs = require('fs')

const Company = require('../models/company')

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
  },

  async create (req, res) {
    console.log(req.body.upload)
    // var newCompany = new Company()
    // newCompany.name = req.body.name
    // newCompany.address = req.body.address
    // newCompany.city = req.body.city
    // newCompany.country = req.body.country
    // newCompany.sector = req.body.sector
    // newCompany.website = req.body.website
    // newCompany.image = req.body.upload
    // try {
    //   await newCompany.save()
    //   req.flash('success', 'Company data has been added.')
    //   await res.redirect('/company/create')
    // } catch (error) {
    //   res.status(500).send({
    //     message: 'cannot create a company'
    //   })
    // }
  },

  async upload (req, res) {
    const form = new formidable.IncomingForm()
    form.uploadDir = path.join(__dirname, '../public/uploads')
    form.on('file', async (field, file) => {
      try {
        await fs.rename(file.path, path.join(form.uploadDir, file.name), (err) => {
          if (err) {
            throw err
          }
          console.log('File has been rename')
        })
      } catch (error) {
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
  }
}
