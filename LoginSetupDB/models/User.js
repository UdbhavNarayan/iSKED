const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username:{
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    /*edited part*/
    verified: {
        type: Boolean
    },
    avatar: {
        type: String,
        // default: 'public/uploads/boy.png'

        default: 'http://images.fineartamerica.com/images-medium-large/alien-face-.jpg' 
    }
}, {timestamps: true})


const User = mongoose.model('User', userSchema)
module.exports = User
