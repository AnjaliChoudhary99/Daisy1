const mongoose = require('mongoose');

const useCasesStructure = {
    smsNotification: Boolean,
    gSheetSync: Boolean
}
const userDataStructure = {
    name : String,
    email : String,
    contactNumber : Number
}

const questionStructure = {
    metadata: mongoose.Schema.Types.Mixed,
    questionTitle: String,
    isAnswerNumber: {type: Boolean, required: true},
}

const formStructure = mongoose.Schema({
    formTitle: {type: String, required: true},
    formDescription: String,
    metadata: mongoose.Schema.Types.Mixed, //this can store any random json object OR String also as metadata
    useCasesAttached: useCasesStructure,
    userData: userDataStructure,
    questions: [questionStructure]
});
mongoose.model('Form', formStructure);

const answerStructure = {
    questionID: String,
    answer: String
}

const responseSchema = mongoose.Schema({
    formId: String,
    userData: userDataStructure,
    answers: [answerStructure]
})

mongoose.model('Response', responseSchema);

// module.exports = formStructure






const userSchema = mongoose.Schema({
    username:String
});
mongoose.model('User', userSchema);