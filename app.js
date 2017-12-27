'use strict';

const express = require('express');
const app = express();

app.get('/', function(req, res) {
    res.json({
        public: process.env.PUBLIC_API_KEY,
        private: process.env.PRIVATE_API_KEY
    });
});

app.post('/', function(req, res) {
    res.json({
        Output: 'Hello World!'
    });
});


// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app;
