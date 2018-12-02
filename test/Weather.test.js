const Botmock = require('botkit-mock');
const assert = require('assert')

const Weather = require('../Capabilities/Weather')

const user = require('./Info.test')

var OpenweatherToken='7bf212dface8e17114014161ddce3318';
var http= require('http');
var request=require('request');

describe("Convert Weather tests", function() {
    afterEach(function() {
        this.controller.shutdown();
    });

    beforeEach(function () {
        this.controller = Botmock({});
        // type can be ‘slack’, facebook’, or null
        this.bot = this.controller.spawn({type: 'slack'});
        Weather(this.controller, request, OpenweatherToken, http);
    });

    it('should return `help message` if user types `help`', function(done) {
        let message = this.bot.usersInput(
            user.userInput('weather in Pune')
        )
        done()
        return assert.equal(message.text.indexOf('in Pune') > -1, true);
        })

    it('should return `help message` if user types `help`', function(done) {
        let message = this.bot.usersInput(
            user.userInput('climate in Pune')
        )
        done()
            assert.equal(message.text.indexOf('in Pune') > -1, true)
    })
})