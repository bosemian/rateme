const mongoose = require('mongoose')
const config = require('./config/config')

module.exports = async function () {
  try {
    mongoose.Promise = global.Promise
    const url = await mongoose.connect(config.databaseURL, { useMongoClient: true })
    console.log(`Database connection at ${url.host}:${url.port}`)
  } catch (error) {
    console.log(`Database connection error: ${error.message}`)
  }
}
