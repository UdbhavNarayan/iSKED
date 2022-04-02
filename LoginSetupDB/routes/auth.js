const express = require('express');
const  router = express.Router()

const AuthController = require('../controllers/AuthController')

const EmployeeController = require('../controllers/EmployeeController')
const upload = require('../middleware/upload')

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)



router.get('/', EmployeeController.index)
router.post('/show', EmployeeController.show)
router.post('/store', upload.array('avatar[]'), EmployeeController.store)
router.post('/update', EmployeeController.update)
router.post('/delete', EmployeeController.destroy)


module.exports = router