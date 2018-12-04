const Botmock = require('botkit-mock');
const assert = require('assert')

const Information = require('../Capabilities/Information');

function userInput(value)
{
    return [
        {
            user: 'me',
            channel: 'lalal',
            messages: [
                {
                    text: value, isAssertion: true
                }
            ]
        }
    ];
}

describe("Information tests",()=>{
    afterEach(() => {
        this.controller.shutdown();
    });

    beforeEach(()=>{
        this.controller = Botmock({});
        // type can be ‘slack’, facebook’, or null
        this.bot = this.controller.spawn({type: 'slack'});
        Information(this.controller);
    });

    it('should return all functions available when user types `help`', () => {
        return this.bot.usersInput(
            userInput('help')
        ).then((message) => {
            return assert.equal(message.text, 'Translation is also there now by: translate <word> to <destinatinLanguage>');
        })
    });

    it('should quick suggestions if user types `hello`', () => {
        return this.bot.usersInput(
            userInput('hello')
        ).then((message) => {
            return assert.equal(message.text, 'Strucked Up!! Message me Help to know more about functionalities');
        })
    });

    it('should return `Dheeraj details` when user types `created by`', () => {
        return this.bot.usersInput(
            userInput('created by')
        ).then((message) => {
            return assert.equal(message.text.indexOf('Follow him on Twitter, Github and Linkedin:') > -1 , true);
        })
    });

    it('should return `No Problem` when user types `Thanks`', () => {
        return this.bot.usersInput(
            userInput('Thanks')
        ).then((message) => {
            return assert.equal(message.text, 'No Problem always there to help!!');
        })
    });
});

module.exports.userInput = userInput