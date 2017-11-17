const formidable = require('formidable')
const path = require('path')
const fs = require('fs')

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

  async upload (req, res) {
    const form = new formidable.IncomingForm()
    form.uploadDir = path.join(__dirname, '../public/uploads')
    form.on('file', async (field, file) => {
      try {
        await fs.rename(file.path, path.join(form.uploadDir, file.name))
        console.log('File has been rename')
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
