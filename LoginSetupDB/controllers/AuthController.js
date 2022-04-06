const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt =  require('jsonwebtoken')
const res = require('express/lib/response')

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

    User.findOne({$or: [{email:email}]},{username:1,password:1,avatar:1})
    .then(user => {
        if(user){
            const avatar = user.avatar;
            const token = user.token;
            bcrypt.compare(password, user.password, function(err, result) {
                if(err) {
                    res.json({
                        error: err
                    })
                }
                if(result){
                    //A variable to store session        
                    //console.log(typeof user)            
                    session = req.session;
                    session.email = email;
                    session.avatar = avatar;
                    //session.token = token;
                    //session.avatar = avatar;
                    //session.avatar = user[0].avatar;
                    //console.log(typeof req)
                    let token = jwt.sign({email: User.email}, 'AzQ,PI)0(', {expiresIn: '1h'})
                    session.token = token
                    res.json({
                        user,
                        message: 'Login Successful', 
                        token,
                    })
                    //session
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
    register, login
}