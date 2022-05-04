const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt =  require('jsonwebtoken')
const res = require('express/lib/response')
const { redirect } = require('express/lib/response')
const path = require('path')
const config = require("../configs/authconfig")
const charac = '20220530hongkongchineseuniversity'
const sendConfirmationEmail = require('../emailsend/sendEmail')



let token = '';
for(let i = 0; i < 25; i++)
{
    token = token + charac[Math.floor(Math.random()*charac.length)];
}
 const register = (req, res, next) => {
    const token = jwt.sign({email: req.body.email}, config.secret)
    bcrypt.hash(req.body.password, 10, function(err, hashedPass){
        if(err) {
            res.json({
                error: err
            })
        }

        let user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
            confirmationCode : token
        })
    
        user.save()
        .then(user => {
            //sendVerificationEmail(user, res)
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
var sess;

var adminEmail = 'admin@gmail.com';
var adminPass = 'admin';
var admflag = 0;

const login = (req, res) =>{
    console.log('Login API called')
    var email = req.body.email
    var password = req.body.password
    if(adminEmail == email && adminPass == password)
    {
        admflag = 1;
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
                        var x = path.basename(avatar)
                        //console.log(x)
                        session.username = username
                        session.avatar = 'http://localhost:3000/uploads/'+ x
                        let token = jwt.sign({email: User.email}, 'AzQ,PI)0(', {expiresIn: '1h'})
                        session.token = token
                        sess = session
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
    avatar = session.avatar
    console.log(avatar)
    console.log(avatar.lastIndexOf(''));
    res.render('../settings.pug', {username: session.username,email: session.email, avatar: session.avatar})
}



// app.get('/logout',function(req,res){
    const logout = (req,res) => {
        if(sess)
        {
            console.log(sess)
            req.session.destroy(function(err) {
                if(err) {
                  console.log(err);
                } else {
                  res.redirect('/project.html');
                }
              });
        }
        else
        {
            res.redirect('../project.html')
        }
    }

module.exports = {
    register, login, logout,settings
}
