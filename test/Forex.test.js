const Botmock = require('botkit-mock');
const assert = require('assert')

const Forex = require('../Capabilities/Forex')

var request=require('request');
var cheerio=require('cheerio');

const userInput = require('./Info.test')

describe("Forex tests",function(){
    afterEach(function() {
        this.controller.shutdown();
    });

    beforeEach(function() {
        this.controller = Botmock({});
        // type can be ‘slack’, facebook’, or null
        this.bot = this.controller.spawn({type: 'slack'});
        Forex(this.controller, request, cheerio);
    });

    it('should return current equivalent forex value when user types `convert`', function(done) {
        let message = this.bot.usersInput(
            userInput.userInput('convert 12 USD to INR')
        )
        done();
        assert.equal(message.text.indexOf('12 USD') > -1 , true)})
});