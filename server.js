const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const engine = require('ejs-mate')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose')

const app = express()
// TODO connect to docker mongoDB
// mongoose.connect('', { useMongoClient: true })
//   .then(() => {
//     console.log('Connected to MongoDB at ')
//     return mongoose.connection
//   })
//   .catch(err => console.log(`Database connection error: ${err.message}`))

app.use(express.static('public'))
app.engine('ejs', engine)
app.set('view engine', 'ejs')
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// session
app.use(session({
  secret: 'Thisismytestkey',
  resave: false,
  saveUninitialized: false
  // store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/test', (req, res) => {
  res.render('test')
})

app.listen(3000, () => {
  console.log('listening on port 3000')
})
