const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt =  require('jsonwebtoken')

 const register = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, function(err, hashedPass){
        if(err) {
            res.json({
                error: err
            })
        }

        let user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass
        })
    
        user.save()
        .then(user => {
            res.json({
                message: "User Added Successfully"
            })
        })
        .catch(error =>{
            res.json({
                message: "An error occured"
            })
        })
    })
}

var session;

const login = (req, res) =>{
    var email = req.body.email
    var password = req.body.password

    console.log(req.session)

    User.findOne({$or: [{email:email}]})
    .then(user => {
        if(user){
            bcrypt.compare(password, user.password, function(err, result) {
                if(err) {
                    res.json({
                        error: err
                    })
                }
                // 
                if(result){
                    //A variable to store session                    
                    session = req.session;
                    session.email = email;
                    //console.log(typeof req)
                    let token = jwt.sign({email: user.email}, 'AzQ,PI)0(', {expiresIn: '1h'})
                    res.json({
                        message: 'Login Successful', 
                        token
                    })
                    console.log(req.session)
                }else{
                    res.json({
                        message: 'Password does not match'
                    })
                }
            })
        }else{
            res.json({
                message: ' No user found'
            })
        }
    })
}



module.exports = {
    register, login
}