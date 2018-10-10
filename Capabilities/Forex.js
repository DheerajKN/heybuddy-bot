module.exports = function forex(controller, request, cheerio) {

    controller.hears(['convert (\\d+) (.*) to (.*)','(\\d+) (.*) to (.*)', 'How much is (\\d+) (.*) in (.*)','How much is (\\d+) (.*) to (.*)'], 'direct_message,direct_mention,mention', function(bot,message) {

        var val = message.match[1];
        var sourceval = message.match[2];
        var destval = message.match[3];

        if(undefined === sourceval || '' === sourceval || null === sourceval)
        {
            bot.reply(message,"Source Index not added please type again!!");
        }
        else if(undefined === destval || '' === destval || null === destval)
        {
            bot.reply(message,"Destination Index not added please type again!!");
        }
        else{
            if(undefined === val || '' === val || null === val)
            {
                bot.reply(message,"Conversion value not added so considering as 1");
                val=1;
            }

        if(sourceval.length>3 || destval.length>3){
            bot.reply(message,'Please use official Currency Index to remove conflicts');
        }
        else if (sourceval.length<2 || destval.length<2){
            bot.reply(message,'Use this format change <value> <unit> into <unit> for metric conversion');
        }
        else{
            request("https://exchangerate.guru/"+sourceval.toLowerCase()+"/"+destval.toLowerCase()+"/"+val+"/",function(err,resp,body){
                var $=cheerio.load(body);
                var valx=$('.form-control').get(1);
                var $valx=$(valx).attr('value');

                var date = new Date();
                var sec  = date.getSeconds().toString();

                if(parseInt(date.getHours(), 10)>11){
                    sec=sec.concat(" PM");
                }else{
                    sec=sec.concat(" AM");
                }
                var week = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
                bot.reply(message,`As of ${week[date.getDay()]}: ${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} and ${date.getHours()}:${date.getMinutes()}:${sec}`);
                if($valx >=5000){
                    bot.reply(message,`val ${sourceval.toUpperCase()} = ${$valx} :money_mouth_face: ${destval.toUpperCase()}`);
                }else if(val>5500){
                    bot.reply(message,`:moneybag: ${val} ${sourceval.toUpperCase()} = ${$valx} :money_with_wings: ${destval.toUpperCase()}`);}
                else{bot.reply(message,`val ${sourceval.toUpperCase()} = ${$valx} ${destval.toUpperCase()}`);
              }
            });
            }
        }
    });

}
