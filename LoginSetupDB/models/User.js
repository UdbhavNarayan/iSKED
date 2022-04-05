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
    avatar: {
        type: String,
        default: 'http://images.fineartamerica.com/images-medium-large/alien-face-.jpg' 
    }
}, {timestamps: true})


const User = mongoose.model('User', userSchema)
module.exports = User