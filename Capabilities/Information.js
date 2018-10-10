module.exports = function routes(controller) {

    controller.hears(['^[H|h]ello','^[H|h]i','^[W|w]hat\'s up??'], 'direct_message,direct_mention,mention', function(bot,message) {
        bot.reply(message,'Hello there!! I\'m the Buddy bot who can help you in Weather, Climate, Metric, Time and Currency Information');
        bot.reply(message,'Strucked Up!! Message me Help to know more about functionalities');
    });

    controller.hears(['^[H|h]elp','^[W|w]hat can you do??'], 'direct_message,direct_mention,mention', function(bot,message) {
        bot.reply(message,'I can help you in Weather, Length, Climate and Currency Updates');
        bot.reply(message,'By typing weather / climate in <city> to know Weather Updates ');
        bot.reply(message,'convert val <sourceCurrency> to <destinationCurrency> for currency updates');
        bot.reply(message,'Time in <city> to get their present Day, Date, Time and UTC information');
        bot.reply(message,'map <sourceunit> in <destunit> for metric conversions');
        bot.reply(message, 'You can also ask Creator related information');
        bot.reply(message, 'Translation is also therenow: translate <word> to <destinatinLanguage>');
    });

    controller.hears(['^[W|w]ho created you', '^[D|d]escribe your creator', '^[C|c]reated by'], 'direct_message,direct_mention,mention', function(bot,message) {
        bot.reply(message,"I was Created by K. N. Dheeraj");
        bot.reply(message,"Backend Developer (Java, Node.js), React Learner, Automation Lover, Bot Creator and Fond of Data Analytics, ML, AI, NLP, Neural Networks and Deep Learning..");
        bot.reply(message,"Follow him on Twitter, Github and Linkedin: https://twitter.com/itsDheerajKn https://github.com/DheerajKN	https://www.linkedin.com/in/dheeraj-kn-878315106/");
    });

    controller.hears(['^Thanks'], 'direct_message,direct_mention,mention', function(bot,message) {
        bot.reply(message,"No Problem always there to help!!");
    });
}
