const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
var session;
// import socketio from "socket.io";
// import WebSockets from "./utils/WebSockets";

//const EmployeeRoute = require('./routes/employee')
const AuthRoute = require('./routes/auth')

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
// router.use(express.static('public'))
// router.use("/admin", express.static(path.join(__dirname, 'admin')));
app.use(express.static(path.join(__dirname, 'public')));
// app.set('view engine', 'pug');

const PORT = process.env.PORT || 3000
// global.io - socketio.listen(PORT);
// global.io.on('connection', WebSockets.connnection)

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`)
})

app.use('/api/employee', AuthRoute)
app.use('/api', AuthRoute)
