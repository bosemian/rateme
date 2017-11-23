const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const ejs = require('ejs')
const path = require('path')
const engine = require('ejs-mate')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose')
const passport = require('passport')
const flash = require('connect-flash')
const validator = require('express-validator')
const _ = require('underscore')
const moment = require('moment')
const config = require('./config/config')

const app = express()
require('./db')()
require('./config/passport')
app.set('superSecret', config.authentications.secret)
// setup middieware
app.engine('ejs', engine)
app.set('view engine', 'ejs')
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(flash())
app.use(validator())
app.use(morgan('dev'))
// session
app.use(session({
  secret: 'Thisismytestkey',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))
app.use(passport.initialize())
app.use(passport.session())
app.locals._ = _
app.locals.moment = moment

const api = express.Router()
app.use('/api', api)
require('./routes/user')(app)
require('./routes/company')(app)
require('./routes/review')(app)
require('./routes/message')(app)

app.use(express.static(path.join(__dirname, 'public')))

app.listen(config.port, () => {
  console.log(`listening on port ${config.port}`)
})
