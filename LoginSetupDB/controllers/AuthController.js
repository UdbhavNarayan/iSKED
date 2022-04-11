const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt =  require('jsonwebtoken')
const res = require('express/lib/response')
const { redirect } = require('express/lib/response')

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


var adminEmail = 'admin@gmail.com';
var adminPass = 'admin';

const login = (req, res) =>{
    console.log('Login API called')
    var email = req.body.email
    var password = req.body.password
    if(adminEmail == email && adminPass == password)
    {
        res.render('../admin/admin.pug')
    }
    else{
        User.findOne({$or: [{email:email}]},{username:1,password:1,avatar:1})
        .then(user => {
            console.log('Login API: Ran user query')
            if(user){
                console.log('Login API: User found')
                const avatar = user.avatar;
                const token = user.token;
                const username = user.username;
                bcrypt.compare(password, user.password, function(err, result) {
                    if(err) {
                        console.log('Login API: Password matching error')
                        res.json({
                            error: err
                        })
                    }
                    if(result){
                        console.log('Login API: Successful')
                        //A variable to store session        
                        //console.log(typeof user)            
                        session = req.session;
                        session.email = email;
                        session.avatar = avatar;
                        session.username = username
                   
                        let token = jwt.sign({email: User.email}, 'AzQ,PI)0(', {expiresIn: '1h'})
                        session.token = token
                    
                        console.log(session)
        
                        res.redirect('../secondpage.html')
                    }else{
                        console.log('Login API: Password does not match')
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
}

const settings = (req, res, next) => {
    console.log(session)
    res.render('../settings.pug', {username: session.username,email: session.email, avatar: session.avatar})
}

//HOW TO GET VARIABLE FROM SESSION??
//var ssn  = req.session
const profile = (req,res) => {
    // var email = .email
    // var password = req.body.password
    res.json({
        //isAuth: true,
        //id: session._id,
        session

    })
}


// app.get('/logout',function(req,res){
    const logout = (req,res) => {
        if(session)
        {
            req.session.destroy(function(err) {
                if(err) {
                  console.log(err);
                } else {
                  res.redirect('/project.html');
                }
              });
        }
        else{
            res.json({
                message: 'Server unreachable. Please close the browser and try again!'
            })
        }
    }


module.exports = {
    register, login, profile, logout,settings
}