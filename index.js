
const express= require("express");
const app= express();
var server = require('http').Server(app);
const mongoose = require('mongoose');
require('dotenv').config();

const formController = require('./formController');
const responseController = require("./responseController");

const User = mongoose.model('User');

const port = 3001;

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


// Use formControlleres as middleware
app.use('/', formController); //TODO - change this also to regex
app.get( /\/submit\/form\/.*/, responseController);
app.post( /\/submit\/form\/.*/, responseController);




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
  const new_user = new User({username:"akhil server"});
  new_user.save();
});