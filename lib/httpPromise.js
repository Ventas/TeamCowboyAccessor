'use strict';

const http = require('http');
const https = require('https');
const querystring = require('querystring');
const URL = require('url');

function httpPostAsPromise(url, params) {
    return new Promise(function(resolve, reject) {
        let postData = querystring.stringify(params);

        let options = URL.parse(url);
        options = Object.assign(options, {
            method: 'POST',
            port: options.protocol.startsWith('https') ? 443 : 80,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        });

        const requestDriver = options.port == 443 ? https : http;

        let request = requestDriver.request(options, (response) => {
            let rawData = '';
            response.on('data', (chunk) => {
                rawData += chunk;
            });
            response.on('end', () => {
                resolve(rawData);
            });
        });

        request.on('error', (error) => {
            reject(error);
        });

        request.write(postData);
        request.end();
    });
}

function httpGetAsPromise(url, params) {
    return new Promise(function(resolve, reject) {
        let formattedUrl = url;
        if (params) {
            formattedUrl += '?' + querystring.stringify(params);
        }

        const requestDriver = formattedUrl.startsWith('https') ? https : http;

        let request = requestDriver.get(formattedUrl, (response) => {
            let rawData = '';
            response.on('data', (chunk) => {
                rawData += chunk;
            });
            response.on('end', () => {
                resolve(rawData);
            });
        });

        request.on('error', (error) => {
            reject(error);
        });
    });
}

function httpGetJson(url, params) {
    return httpGetAsPromise(url, params)
        .then(function(rawData) {
            return JSON.parse(rawData);
        });
}

function httpPostJson(url, params) {
    return httpPostAsPromise(url, params)
        .then(function(rawData) {
            return JSON.parse(rawData);
        });
}

Object.assign(module.exports, {
    post: httpPostAsPromise,
    get: httpGetAsPromise,
    getJson: httpGetJson,
    postJson: httpPostJson
});