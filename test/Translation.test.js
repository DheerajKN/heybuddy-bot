const Botmock = require('botkit-mock');
const assert = require('assert')

const Translation = require('../Capabilities/Translation')

const user = require('./Info.test')

describe("Convert Translation tests", function() {
    afterEach(function() {
        this.controller.shutdown();
    });

    beforeEach(function () {
        this.controller = Botmock({});
        // type can be ‘slack’, facebook’, or null
        this.bot = this.controller.spawn({type: 'slack'});
        Translation(this.controller);
    });

    it('should return `translated text` when user types `translate`', function(done) {
        let message = this.bot.usersInput(
            user.userInput('translate Ich spreche Englisch from German to te')
        )
        done()
            assert.equal(message.text.indexOf('Ich spreche Englisch in') > -1, true);
        })
});