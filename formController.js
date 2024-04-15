const express = require('express');
const formController = express.Router();
const fs = require('fs');
const mongoose = require("mongoose")

//argument is path to file without extension name which contains the model
const formStructure = require('./schema'); 
const { log } = require('console');
const { addNewSheet, addRowToSheet } = require('./gSheetController');
// var Form = mongoose.model("Form", formStructure);
const Form = mongoose.model("Form");
// const User = mongoose.model('User');


formController.get('/', (req, res) => {
    fs.readFile('homePageMessage.txt', 'utf8', (err, fileContent) =>{
      if (err) {
          console.log("ERROR in reading message from homePageMessage.txt: " + err.message);
          var message = "error in reading message from homePageMessage.txt :\n";
          res.send(message + err);
        } else {
          res.send(fileContent);
        }
    })
});


formController.post('/', (req, res) => {
    // Handle POST request
    res.send('POST request received!');
});




// GET route for form creation
formController.get('/create/form', (req,res) => {
    console.log("GET: /create/form");

    //read from file
    fs.readFile('sampleFormJson.txt', 'utf8', (err, fileContent) => {
        if (err) {
          console.log("ERROR: reading from file");
          console.error(err);
        } else {
          res.send(JSON.parse(fileContent));
        }
      });

})

function validationPassed(){
    return true;
}

async function saveFormInDb(jsonBody){

    // desearialize the json object and pass the key-value pairs to Form() argument
    const newForm = new Form( 
      {useCasesAttached, userData, metadata, questions } = jsonBody 
    )
    const savedForm = await newForm.save(); // Wait for save to complete
    return savedForm._id;
}



// CREATE A NEW FORM
// body-parser middleware returns 400 bad request if invalid json entered by user
formController.post('/create/form', async (req,res) => {
    console.log("POST: /create/form");
    
    if( !validationPassed(req.body) ){ // validate the individual data types... LATER
      console.log("ERROR: validation failed for body = " + JSON.stringify(req.body));
      res.send("invalid data types");
    }

    var savedFormId;
    try {
      savedFormId = await saveFormInDb(req.body);
    } catch (error) {
      return res.status(400).send(error.message);
    }
    
    // trigger the attached use cases - TODO implement this in loop
    if(req.body.useCasesAttached.smsNotification){
        console.log("sms wanted: yes");
    }
    if(req.body.useCasesAttached.gSheetSync){
        console.log("gsheet entry wanted: yes");
        // create new sheet in gsheet with name = formId
        await addNewSheet(process.env.SPREAD_SHEET_ID, savedFormId);

        // add header row into spreadsheet
        await addRowToSheet(process.env.SPREAD_SHEET_ID, savedFormId, ["title1", "title2", "title3"])
    }

    res.send("form creation successful & form id = " + savedFormId);
})

module.exports = formController;