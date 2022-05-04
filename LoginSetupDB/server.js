const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
var session;
const AuthRoute = require('./routes/auth')

//Connection to local host database.
mongoose.connect('mongodb://localhost:27017/testdb', {useNewUrlParser: true, useUnifiedTopology: true} )
const db = mongoose.connection

db.on('error', (err) => {
    console.log(err)
})

db.once('open', () => {
    console.log('Database conncetion established')
})


const  app = express()

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use('/uploads', express.static('uploads'))

var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000


app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`)
})

app.use('/api', AuthRoute)
