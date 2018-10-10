var Botkit = require('botkit');
var http= require('http');
var request=require('request');
var cheerio=require('cheerio');

var slackToken=process.env.SLACK_TOKEN;
var OpenweatherToken=process.env.OPENWEATHER_TOKEN;

var routes = require('./Capabilities/Information')
var timer = require('./Capabilities/Time')
var weather = require('./Capabilities/Weather')
var forex = require('./Capabilities/Forex')
var metric = require('./Capabilities/ConvertMetric')
const translator = require('./Capabilities/Translation');

const controller = Botkit.slackbot({
    debug: false
});

controller.spawn({
    token: slackToken

}).startRTM(function(err,bot,payload) {
    if (err) {
        throw new Error('Could not connect to Slack');
    }
    console.log('Connected to Slack');
});

routes(controller);
timer(controller, request, cheerio);
weather(controller, request, cheerio, OpenweatherToken, http);
forex(controller, request, cheerio);
metric(controller);
translator(controller)
