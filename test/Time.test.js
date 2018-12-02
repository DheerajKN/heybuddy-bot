const Botmock = require('botkit-mock');
const assert = require('assert')

const Time = require('../Capabilities/Time')

var request=require('request');
var cheerio=require('cheerio');

const user = require('./Info.test')

describe("Time tests", function(){
    afterEach(function() {
        this.controller.shutdown();
    });

    beforeEach(function() {
        this.controller = Botmock({});
        // type can be ‘slack’, facebook’, or null
        this.bot = this.controller.spawn({type: 'slack'});
        Time(this.controller, request, cheerio);
    });

    it('should return `current time of the location` when user types `time`', function(done) {
        let message = this.bot.usersInput(
            user.userInput('time in Pune')
        )
        done();
        assert.equal(message.text.indexOf('They follow:') > -1 , true)
    })
});