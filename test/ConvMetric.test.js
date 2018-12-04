const Botmock = require('botkit-mock');
const assert = require('assert')

const convMetric = require('../Capabilities/ConvertMetric')

const user = require('./Info.test')

describe("ConvertMetric tests",()=> {
    afterEach(() => {
        this.controller.shutdown();
    });

    beforeEach(() => {
        this.controller = Botmock({});
        // type can be ‘slack’, facebook’, or null
        this.bot = this.controller.spawn({type: 'slack'});
        convMetric(this.controller);
    });

    it('should provide metric equivalent of the value provided when user enters `change`', () => {
        return this.bot.usersInput(
            user.userInput('change 12 mm into cm')
        ).then((message) => {
            return assert.equal(message.text.indexOf('12 mm =') > -1, true);
        })
    });
});