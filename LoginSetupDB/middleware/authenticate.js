const jwt = require('jsonwebtoken')


//Token creation for secured route access.
const authenticate = (req,res,next) => {
    try{

        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, 'AzQ,PI)0(')

        req.user = decode
        next()

    }
    catch(error){
        res.json({
            message: 'Authentication Failed'
        })
    }
}

module.exports = authenticate