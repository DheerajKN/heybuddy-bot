
module.exports = function timer(controller, request, cheerio) {
controller.hears(['time in (.*)','day in (.*)','date in (.*)','utc of (.*)'], 'direct_message,direct_mention,mention', function(bot,message) {

    var timeloc = message.match[1];

    if(timeloc == undefined || timeloc === '' || timeloc === null)
    {
        bot.reply(message.text,"Location not added please type again!!");
    }

    request(`https://time.is/${timeloc.replace(" ","_")}`,function(err,resp,body){
        var $=cheerio.load(body);

        var timev=$('div#twd').text();
        var secv=$('span#leaps.leap0').text();
        if(parseInt(timev.substring(0,timev.indexOf(':')), 10)>11){
            secv=secv.concat(" PM");
        }else{
            secv=secv.concat(" AM");
        }

        var dayv=$('div#dd.w90.tr').text();

        var utcv=$('.keypoints ul li').get(0);
        var utcval=$(utcv).text();

        bot.reply(message,`Time in ${timeloc} is ${timev.concat(secv)}`);
        bot.reply(message,`Day, Date is ${dayv}`);
        bot.reply(message,`They follow: ${utcval}`);
    });
});
}
