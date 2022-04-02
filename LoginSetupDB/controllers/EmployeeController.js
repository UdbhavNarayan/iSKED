const { response } = require('express')
const User = require('../models/User')

// Show list of Employees
const index = (req, res, next) => {
    User.find()
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: 'An error occured'
        })
    })
}

// Show single employee
const show = (req, res, next) => {
    let employeeID = req.body.employeeID
    User.findById(employeeID)
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: 'An error occured'
        })
    })
}

//add new employee
const store = (req,res, next) => {
    let employee = new User({
        email: req.body.email,
        password: req.body.password
    })
    if(req.files) {
        let path = ''
        req.files.forEach(function(files, index,arr){
            path = path + files.path + ','
        })
        path = path.substring(0,path.lastIndexOf(","))
        employee.avatar = path
    }
    employee.save()
    .then(response => {
        res.json({
            message: 'Employee added successfully'
        })
    })
    .catch(error => {
        res.json({
            message: 'An error occured'
        })
    })
}


//update an employee
const update = (req, res, next) => {
    let employeeID = req.body.employeeID
    let updatedData = {
        email: req.body.email,
        password: req.body.password
    }

    User.findByIdAndUpdate(employeeID, {$set: updatedData})
    .then(() => {
        res.json({
            message: 'Employee updated successfully!'
        })
    })
    .catch(error => {
        res.json({
            message: 'An error occured!'
        })
    })
}


//delete an employee
const destroy = (req,res,next) => {
    let employeeID = req.body.employeeID
    User.findByIdAndRemove(employeeID)
    .then(() => {
        res.json({
            message: 'Employee Deleted Successfully'
        })
    })
    .catch(error => {
        res.json({
            message: 'an error occured'
        })
    })
}

module.exports = {
    index,show,store,update,destroy
}