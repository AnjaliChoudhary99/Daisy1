const express = require('express');
const responseController = express.Router();
const mongoose = require("mongoose")
const ObjectId = require('mongoose').Types.ObjectId;

// this line is important to import all the schema models from schemas.js file
const formStructure = require('./schema'); 

const Form = mongoose.model("Form");
const User = mongoose.model('User');
const Response = mongoose.model('Response');


async function extractResponseField(jsonForm){
    // keep only userData & [questionTitle, _id, answer] in this json

    var listOfQuestions = []
    for( const question of jsonForm["questions"]){
        const temp = {
            "questionTitle": question.questionTitle,
            "_id": question._id,
            "answer": "fill the form"
        }
        listOfQuestions.push(temp);
    }

    return {
        "userData": jsonForm["userData"],
        "questions": listOfQuestions
    };
}

// returns a json representing the form
responseController.get( "/submit/form/:form_id" , async (req,res) => {
    console.log("GET: /submit/form/:form_id");
    const {form_id} = req.params;

    try {
        var form = await Form.findById(form_id);
        if (form) {
            console.log("form found: " + form);
            
            form = await extractResponseField(form);
            // should add answer fields ?
            res.send(form);
        } else {
            return res.status(400).send("Invalid form_id: "+form_id);
        }
      } catch (err) {
        console.error(err);
        return res.send("error in processing request");
      }

} );


responseController.post( "/submit/form/:form_id" , async (req,res) => {
    console.log("POST: /submit/form/:form_id");
    const inputJson = req.body;
    // extract userData & questions-answers only ?
    
    var listOfAnswers = []

    for(const x of req.body.questions){
        const temp = { "questionID": x._id, "answer": x.answer}
        listOfAnswers.push(temp);
    }



    var savedResponse;
    try {
        const newResponse = new Response({
            formId: req.params.form_id,
            userData: req.body.userData,
            answers: listOfAnswers
        })

        // TODO: logic for form resubmission by a user - check is form_id & email_id combination is present, then update it.

        savedResponse = await newResponse.save();
    } catch (error) {
      return res.status(400).send(error.message);
    }

    // save to gsheet ?
    // notify
    
    
    res.send("response submitted & response id = " + savedResponse._id);
} )



// make a handler for fetching a saved response also - TODO


module.exports = responseController;