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
    //this variable is 'False' till email of new user hasn't been verified, after which it changes to 'True'
    verified: {
        type: Boolean
    },
    avatar: {
        type: String,
        default: 'http://images.fineartamerica.com/images-medium-large/alien-face-.jpg' 
    }
}, {timestamps: true})


const User = mongoose.model('User', userSchema)
module.exports = User
