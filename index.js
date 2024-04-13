
const express= require("express");
const app= express();
const port = 3001;
var server = require('http').Server(app);
const mongoose = require('mongoose');

const ejs = require("ejs");
app.set("view engine", "ejs");


const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// Error handling middleware for parsing errors
app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        // Handle parsing error
        console.error('Error parsing JSON:', error);
        res.status(400).send('Invalid JSON, error=' + error);
    } else {
        // Pass the error to the next middleware
        next(error);
    }
});

// require formcoltroller
const fc = require('./formController');

// Use formControlleres as middleware
app.use('/', fc);


var DB_URL = "mongodb://127.0.0.1:27017/atlan_db";
db = mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("connected to db")
}).catch((err)=>{
    console.log("Error connecting to db: " + err.message);
})



server.listen(port, function(){
  console.log("Server listening on port ", port);
});