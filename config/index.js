module.exports = {
  databaseURL: 'mongodb://192.168.99.100:27017/rateme',
  authentications: {
    secret: 'emetar'
  },
  port: process.env.PORT || 4200
}
