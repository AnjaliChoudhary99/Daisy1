const questionStructure = {
    qustionTitle: String,
    isValueNumber: Boolean,
    value: String
}

const formMetaDataStructure = {
    formTitle: String,
    description: String,
    creatorName: String
}

var formStructure = {
    formMetadata: {type: formMetaDataStructure, required: true},
    formColor: String
}


module.exports = formStructure