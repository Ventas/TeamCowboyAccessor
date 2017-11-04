'use strict';

const express = require('express');
const app = express();

app.get('/', function(req, res) {
  res.json({
    one: 'one',
    two: {
        a: 'a',
        b: 'b'
    }
  });
});

app.post('/', function(req, res) {
  res.json({
    Output: 'Hello World!'
  });
});


// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app;
