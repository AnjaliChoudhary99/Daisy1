const express = require('express');
const formController = express.Router();

// Define your routes
formController.get('/', (req, res) => {
    res.send('Hello, World!');
});


formController.post('/', (req, res) => {
    // Handle POST request
    res.send('POST request received!');
});

module.exports = formController;