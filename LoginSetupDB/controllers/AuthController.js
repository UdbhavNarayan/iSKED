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

var session;

const login = (req, res) =>{
    console.log('Login API called')
    var email = req.body.email
    var password = req.body.password

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
                    //session.token = token;
                    //session.avatar = avatar;
                    //session.avatar = user[0].avatar;
                    //console.log(typeof req)
                    let token = jwt.sign({email: User.email}, 'AzQ,PI)0(', {expiresIn: '1h'})
                    session.token = token
                    // res.json({
                    //     user,
                    //     message: 'Login Successful', 
                    //     token,
                    // })
                    //session
                    console.log(session)
                     //res.render('../views/index.pug', {email: session.email, username: session.username, avatar: session.avatar})
                    res.render('../views/test.pug', {email: session.email, username: session.username, avatar: session.avatar});
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
    req.session.destroy(function(err) {
      if(err) {
        console.log(err);
      } else {
        res.redirect('/project.html');
      }
    });
  }
// logout.logout (req,res,function(err,data) {
//         session = req.session;
//         session.destroy(function(err) {
//             if(err){
//                 msg = 'Error destroying session';
//                 res.json(msg);
//             }else{
//                 msg = 'Session destroy successfully';
//                 console.log(msg)
//                 res.json(msg);
//             }
//         });
//         //res.json({ 'success': data.success, 'message': data.message });
//     }


module.exports = {
    register, login, profile
}