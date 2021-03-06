'use strict';

const crypto = require('crypto');
const uuid = require('uuid/v1');

const httpPromise = require('../httpPromise');

const API_URL = 'http://api.teamcowboy.com/v1/';
const SECURE_API_URL = 'https://api.teamcowboy.com/v1/';

function callGetApi(params) {
    return httpPromise.getJson(API_URL, params)
        .then(function(result) {
            return result.body;
        });
}

function callPostApi(params) {
    return httpPromise.postJson(API_URL, params)
        .then(function(result) {
            return result.body;
        });
}

function TeamCowboy(publicApiKey, privateApiKey, userToken) {
    this.publicApiKey = publicApiKey;
    this.privateApiKey = privateApiKey;
    this.userToken = userToken;
}

TeamCowboy.prototype.generateParams = function(apiMethod, httpMethod, apiParams) {
    let params = {
        api_key: this.publicApiKey,
        method: apiMethod,
        timestamp: Math.floor(Date.now() / 1000),
        nonce: uuid()
    };
    Object.assign(params, apiParams);

    let paramsArray = [];
    Object.keys(params).sort().forEach(function(key) {
        let value = typeof params[key] === 'string' ? params[key].toLowerCase() : params[key];
        paramsArray.push(encodeURIComponent(key.toLowerCase()) + '=' + encodeURIComponent(value));
    });

    let rawSignature = [
        this.privateApiKey,
        httpMethod,
        params.method,
        params.timestamp,
        params.nonce,
        paramsArray.join('&')
    ].join('|');

    const hash = crypto.createHash('sha1');
    hash.update(rawSignature);
    params.sig = hash.digest('hex');

    return params;
};

TeamCowboy.prototype.login = function(username, password) {
    let params = this.generateParams('Auth_GetUserToken', 'POST', {
        username: username,
        password: password
    });
    let _this = this;

    return httpPromise.postJson(SECURE_API_URL, params)
        .then(function(authResult) {
            _this.userToken = authResult.body.token;
            return _this.userToken;
        });
};

TeamCowboy.prototype.getTeams = function() {
    let params = this.generateParams('User_GetTeams', 'GET', {
        userToken: this.userToken
    });
    return callGetApi(params);
};

TeamCowboy.prototype.getNextGame = function() {
    let params = this.generateParams('User_GetNextTeamEvent', 'GET', {
        userToken: this.userToken,
        includeRSVPInfo: true //Undocumented in the API!!
    });
    return callGetApi(params);
};

TeamCowboy.prototype.rsvp = function(teamId, eventId, rsvpStatus) {
    let params = this.generateParams('Event_SaveRSVP', 'POST', {
        userToken: this.userToken,
        teamId: teamId,
        eventId: eventId,
        status: rsvpStatus
    });
    return callPostApi(params);
};

Object.assign(module.exports, {
    TeamCowboy: TeamCowboy
});