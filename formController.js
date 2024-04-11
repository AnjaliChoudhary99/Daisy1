const express = require('express');
const formController = express.Router();
const fs = require('fs');

// Define your routes
formController.get('/', (req, res) => {

    var message = 
    "Welcome to Daisy1 project\n\n" +
    "Endpoints:\n" + 
    "1. /create/form : new form creation\n" +
    "2. /form/{form_id} : to submit a response";

    res.send(message);

    // we can show this data on homepage:
    // 1. list of available form ids in system []
    // 2. how to create a new form
    // 3. how to fill a form 



    // {
    //   "title":"Welcome to Daisy1 project",
    //   "guidelines": {
    //     "formCreation": "hit this endpoint for form creation: GET /create/form",
    //     "responseSubmission": "hit this endpoint for form submission:  ??"
    //   },
    //   "allFormIds": [123, 342, 234235]
    // }
    
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
          console.log("fileContent=" + fileContent);
          var message = "It is a sample form json, modify it and send a post request:\n\n\n" + fileContent;
          res.send(message);
        }
      });

})

function validationPassed(){
    return true;
}

function saveInDb(){
    return 1;
}



formController.post('/create/form', (req,res) => {
    console.log("POST: /create/form");
    // body-parser middleware returns 400 bad request if invalid json is there

    // validate the individual data types... LATER
    if( !validationPassed(req.body) ){
      console.log("ERROR: validation failed for body = " + JSON.stringify(req.body));
      res.send("invalid data types");
    }
    
    // save to DB
    var generatedFormId = saveInDb();

    // trigger the attached use cases
    
    // TODO implement this in loop
    if(req.body.useCasesAttached.smsNotification == "yes"){
        console.log("sms wanted: yes");
    }
    if(req.body.useCasesAttached.gSheetSync == "yes"){
        console.log("gsheet entry wanted: yes");
    }

    res.send("request successful & form id = " + generatedFormId);
})

module.exports = formController;