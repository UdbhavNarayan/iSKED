var express = require("express");
var bodyParser = require("body-parser");

const mong = require('mongoose');
const { builtinModules } = require("module");
mong.connect('mongodb+srv://ekansh:<password>@cluster0.zygma.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
var dt  = mong.connection;
dt.on('error',console.log.bind(console,"connection failed!"));
dt.once('open',function(callback){
    console.log('success');

})

var app = express()

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('project', function(req,res){
    var nm = req.body.name;
    var el = req.body.email;
    var pass = req.body.pass;

var data = {
    "name": nm,
    "email": el,
    "password":pass,
}

dt.collection('info').insertOne(data,function(err, collection){
    if(err) throw err;
    console.log("Record Insertion Successfull");
});

return res.redirect('XYZ');   //ADD html page name here to be shown after successful sign up

})


//Will be configured later
// app.get('/', function(req,res){
//     res.set({
//         'Access-control-Allow-Origin':'*'
//     });
//     return res.redirect('index.html');
// }).listen(3000)

// console.log('server at port 3000')