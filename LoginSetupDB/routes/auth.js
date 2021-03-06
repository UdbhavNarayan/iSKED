const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

const  router = express.Router()

const AuthController = require('../controllers/AuthController')

const AdminController = require('../controllers/AdminController')
const upload = require('../middleware/upload')
const authenticate = require('../middleware/authenticate')

const app = express();
const oneDay = 1000 * 60 * 60 * 24;

router.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));



router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(express.static(__dirname));
router.use(cookieParser());


//API CALLS
router.post('/register', AuthController.register)
router.post('/login', AuthController.login)

router.get('/',  AdminController.index) //ADMIN AUTHENTICATION
router.post('/show',  AdminController.show) //ADMIN AUTHENTICATION
router.post('/store', upload.array('avatar[]'), AdminController.store) 
router.post('/update', AdminController.update)
router.post('/delete', AdminController.destroy) //ADMIN AUTHENTICATION
router.get('/logout', AuthController.logout)
router.get('/settings', AuthController.settings)
router.get("/verify/:userID/:uniqueString",AuthController.verifcation)
router.get("/verified",AuthController.verified)



module.exports = router