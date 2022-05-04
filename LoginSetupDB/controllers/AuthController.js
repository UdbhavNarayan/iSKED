const User = require('../models/User')

/*user verification model*/
const UserVerification = require('../models/UserVerification')

/*email handler*/
const nodemailer = require("nodemailer");

/*unique string*/
const {v4: uuidv4} = require("uuid");

/*env files*/
require("dotenv").config();

const bcrypt = require('bcryptjs')

//path for static verified page
const path = require("path");

/*nodemailer stuff*/
let transporter = nodemailer.createTransport({
    "service": "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        password: process.env.AUTH_PASSWORD
    }
});

/*transporter.verify((error, success) => {
    if(error){
        console.log(error);
    }
    else{
        console.log("Ready for message");
        console.log(success);
    }
});*/

const jwt =  require('jsonwebtoken')
const res = require('express/lib/response')
const { redirect } = require('express/lib/response')
const path = require('path')

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
            password: hashedPass,
            verified: false
        })
    
        user.save()
        .then(user => {
            //handle email verification
            sendVerificationEmail(user, res);
            /*res.json({
                message: "User Added Successfully"
            })*/
        })
        .catch(error =>{
            res.json({
                message: "An error occured"
            })
        })
    })
}
//NEW PART
//send verification email
const sendVerificationEmail = ({_id, email}, res) => {
    const currentUrl = "http://localhost:3000/";

    const uniqueString = uuidv4() + _id;

    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Verify your email",
        html: `<p>Verify your email to complete your registration and login to your account!</p>
        <p>This link expires in 6 hours</p><p>Press <a 
        href=${currentUrl + "user/verify/" + _id + "/" + uniqueString}> here</a> to proceed</p>`,
    };
    //hash the uniqueString
    const saltrounds = 10;
    bcrypt
        .hash(uniqueString, saltrounds)
        .then((hashedUniqueString) => {
            //set values in user verification collection
            const newVerification = new UserVerification({
                userId: _id,
                uniqueString: hashedUniqueString,
                createdAt: Date.now(),
                expiresAt: Date.now() + 21600000,
            });

            newVerification
                .save()
                .then(() => {
                    transporter
                        .sendMail(mailOptions)
                        .then(() => {
                            //email sent and verification record saved
                            res.json({
                                status: "PENDING",
                                message: "Verification email sent",
                            });
                        })
                        .catch((error) => {
                            console.log(error);
                            res.json({
                                status: "FAILED",
                                message: "Verification email failed to send!",
                            });
                        });
                })
                .catch((error) => {
                    console.log(error);
                    res.json({
                        status: "FAILED",
                        message: "Couldn't save verification email data!",
                    });
                });
        })
        .catch(() => {
            res.json({
                status: "FAILED",
                message: "An error occurred while hashing email data!",
            });
        });
};

//verify email
router.get("/verify/:userID/:uniqueString", (req, res) => {
    let { userID, uniqueString } = req.params;

    UserVerification
        .find({userID})
        .then(user => {
            if (user.length > 0){
                //user verification record exists

                const {expiresAt} = user[0];
                const hashedUniqueString = user[0].uniqueString;

                if (expiresAt < Date.now()){
                    //record has expired so we delete it
                    UserVerification
                        .deleteOne({userID})
                        .then(user => {
                            User
                                .deleteOne({_id: userID})
                                .then(() => {
                                    let message = "Link has expired. Please try again";
                                    res.redirect(`/user/erified/error=true&message=${message}`);
                                })
                                .catch(error => {
                                    let message = "clearing user with expired unique string failed";
                                    res.redirect(`/user/erified/error=true&message=${message}`);
                                })
                        })
                        .catch((error) => {
                            console.log(error);
                            let message = "An error occurred while clearing the expired user verification record";
                            res.redirect(`/user/erified/error=true&message=${message}`);
                        })
                }
                else{
                    //valid record exists so we validate the user string
                    //first we compare the hashed unique string
                    bcrypt
                        .compare(uniqueString, hashedUniqueString)
                        .then(user => {
                            if(user){
                                //string matches
                                User
                                    .updateOne({_id: userID}, {verified: true})
                                    .then(() => {
                                        UserVerification
                                            .deleteOne({userID})
                                            .then(() => {
                                                res.sendFile(path.join(__dirname, "./../views/verified.html"));
                                            })
                                            .catch(error => {
                                                console.log(error);
                                                let message = "error occurred while finalising successful verification";
                                                res.redirect(`/user/erified/error=true&message=${message}`);
                                            })
                                    })
                                    .catch(error => {
                                        console.log(error);
                                        let message = "error occurred while updating user recordto show verified";
                                        res.redirect(`/user/erified/error=true&message=${message}`);
                                    })
                            }
                            else{
                                let message = "Invalid verification details passed. Check inbox.";
                                res.redirect(`/user/erified/error=true&message=${message}`);
                            }
                        })
                        .catch(error => {
                            let message = "error occurred while comparing the unique strings";
                            res.redirect(`/user/erified/error=true&message=${message}`);
                        })
                }
            }
            else{
                //user verification record doesn't exist
                let message = "User account record doesn't exist or has already been verified. Please register or log-in";
                res.redirect(`/user/erified/error=true&message=${message}`);
            }
        })
        .catch((error) => {
            console.log(error);
            let message = "An error occurred while checking for existing user verification record";
            res.redirect(`/user/erified/error=true&message=${message}`);
        })
});

//verified page route
router.get("/verified", (req, res) => {
    res.sendFile(path.join(__dirname, "./../views/verified.html"));
})

//NEW PART ends
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
            //NEW PART
            if(user){
                if(!user[0].verified){
                    res.json({
                        status: "FAILED",
                        message: "Email hasn't been verified yet. Check inbox."
                    })
                }
                //NEW PART ENDS
                else{
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
                } 
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
