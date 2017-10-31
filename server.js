const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const engine = require('ejs-mate')
const session = require('express-session')

const app = express()

app.use(express.static('public'))
app.engine('ejs', engine)
app.set('view engine', 'ejs')
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(3000, () => {
  console.log('listening on port 3000')
})
