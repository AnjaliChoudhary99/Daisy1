
const express= require("express");
const app= express();
const port = 3001;
var server = require('http').Server(app);

const ejs = require("ejs");
app.set("view engine", "ejs");


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

// require formcoltroller
const fc = require('./formController');

// Use formControlleres as middleware
app.use('/', fc);



server.listen(port, function(){
    console.log("Server listening on port ", port);
  });