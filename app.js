'use strict';

const express = require('express');

const TeamCowboy = require('./lib/teamCowboy/teamCowboy').TeamCowboy;

const PUBLIC_API_KEY = process.env.PUBLIC_API_KEY;
const PRIVATE_API_KEY = process.env.PRIVATE_API_KEY;
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

const app = express();

app.get('/', function(req, res) {
    const teamCowboy = new TeamCowboy(PUBLIC_API_KEY, PRIVATE_API_KEY);

    teamCowboy.login(USERNAME, PASSWORD).then(function(userToken) {
        teamCowboy.getNextGame().then(function(game) {
            res.json(game);
        });
    });
});

app.post('/', function(req, res) {
    res.json({
        Output: 'Hello World!'
    });
});


// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app;
