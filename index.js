var Botkit = require('botkit');
var http= require('http');
var request=require('request');
var cheerio=require('cheerio')

var slackToken=process.env.SLACK_TOKEN;
var OpenweatherToken=process.env.OPENWEATHER_TOKEN;

var controller = Botkit.slackbot({
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

controller.hears(['hello','Hi','What\'s up??'], 'direct_message,direct_mention,mention', function(bot,message) {
    bot.reply(message,'Hello there!! I\'m the Buddy bot who can help you in Weather, Climate, Length, Time and Currency Information');
    bot.reply(message,'Strucked Up!! Message me Help to know more about functionalities');
});

controller.hears(['[H|h]elp','What can you do??'], 'direct_message,direct_mention,mention', function(bot,message) {
    bot.reply(message,'I can help you in Weather, Length, Climate and Currency Updates');
    bot.reply(message,'By typing weather / climate in <city> to know Weather Updates ');
    bot.reply(message,'convert val <sourceCurrency> to <destinationCurrency> for currency updates');
    bot.reply(message,'Time in <city> to get their present Day, Date, Time and UTC information');
    bot.reply(message,'map <sourceunit> in <destunit> for length conversions');
    bot.reply(message, 'You can also ask Creator related information');
});

controller.hears(['weather in (.*)', 'weather of (.*)','(.*)\'s weather'], 'direct_message,direct_mention,mention', function(bot,message) {
    var city = message.match[1];
    console.log("city: "+city);
    if(undefined === city || '' === city || null === city)
    {
        bot.reply(message,"Didn't you forgot the city name? I am really sorry, currently I can't guess your city.");
    }
    else{
        var options = {
            protocol : 'http:',
            host : 'api.openweathermap.org',
            path : '/data/2.5/weather?q='+city.replace(" ","+")+'&appid='+OpenweatherToken,
            port : 80,
            method : 'GET'
        };

        var request = http.request(options, function(response){

            response.on('data', function(data) {
                var weather = JSON.parse(data);
                var Temp= Math.round(weather.main.temp - 273.15) + '°C ';
                console.log("weather: " + weather.weather[0].main);
                var msg="The Temp is "+ Temp + "and In " + city;
                switch(weather.weather[0].main)
                {
                    case "Clear":
                        bot.reply(message,msg+" it's Clear Sky");
                        bot.reply(message,":mostly_sunny:");
                        bot.reply(message,"Its good idea to wear sunglasses before going out");
                        break;
                    case "Clouds":
                    case "Cloud":
                        bot.reply(message,msg+" it's Raining");
                        bot.reply(message,":cloud:");
                        bot.reply(message,"Better to carry an Umbrella");
                        break;
                    case "Smoke":
                        bot.reply(message,msg+" it's Foggy");
                        bot.reply(message,":smoking:");
                        bot.reply("Wear Proper Face Mask before leaving home");
                        break;
                    case "Rain":
                        bot.reply(message,msg+" It's Raining");
                        bot.reply(message,":rain_cloud:");
                        bot.reply(message,"Please carry umbrella if you are in " + city);
                        break;
                    case "Thunderstorm":
                        bot.reply(message,msg+" It's gonna Slackbe Thunderous Rain");
                        bot.reply(message,":thunder_cloud_and_rain:");
                        bot.reply(message,"Please don't go out if you are in " + city);
                        break;
                    case "Drizzle":
                        bot.reply(message,msg+" It's Drizzling");
                        bot.reply(message,":partly_sunny_rain:");
                        bot.reply(message,"Carry Umbrella it should be fine in " + city);
                        break;
                    case "Haze":
                        bot.reply(message,"The Temp is "+ Temp);
                        bot.reply(message,":barely_sunny:");
                        bot.reply(message,"There would be partly sunny in " + city);
                        break;
                    case "Snow":
                        bot.reply(message,"The Temp is "+Temp);
                        bot.reply(message,":snow_cloud: :snowman:");
                        bot.reply(message,"Please wear Warm clothes those living in " + city);
                        break;
                }
            });
            response.on('end', function() {
                /*res.send(JSON.parse(body)) */
            });
        });
        request.on('error', function(e) {
            console.log('Problem with request: ' + e.message);
            bot.reply(message, "sorry, couldn't find weather info for city " + city);
        });
        request.end();
    }
});


controller.hears(['climate in (.*)','climate of (.*)','(.*)\'s climate'], 'direct_message,direct_mention,mention', function(bot,message) {
    var city = message.match[1];
    if(undefined === city || '' === city || null === city)
    {
        bot.reply(message,"Didn't you forgot the city name? I am really sorry, currently I can't guess your city.");
    }
    else{
        var options = {
            protocol: 'http:',
            host: 'api.openweathermap.org',
            path: '/data/2.5/weather?q=' + city.replace(" ", "+") + '&appid=' + OpenweatherToken,
            port: 80,
            method: 'GET'
        };
        var request = http.request(options, function (response) {
            var bodycontent = "";
            response.on('data', function (data) {
                bodycontent += data;
                var weather = JSON.parse(bodycontent);

                function LongLatcheck(a, status) {
                    var n = a > 0 ? status === 'lat' ? a + "°N" : a + "°E" : status === 'lon' ? Math.abs(a) + "°W" : Math.abs(a) + "°S";
                    return n;
                }

                bot.reply(message, "Quick Fact: " + city + " is located at " + LongLatcheck(weather.coord.lat, 'lat') + " and " + LongLatcheck(weather.coord.lon, 'lon'));
                bot.reply(message, "Temperature Varies from " + Math.round(weather.main.temp_min - 273.15) + "°C  to " + Math.round(weather.main.temp_max - 273.15) + "°C  at this place");
            });
            response.on('end', function () {
                /*res.send(JSON.parse(body)) */
            });
        });
        request.on('error', function (e) {
            console.log('Problem with request: ' + e.message);
            bot.reply(message, "sorry, couldn't find Temperature info for city " + timeloc);
        });
        request.end();
    }
});

controller.hears(['map (.*) (.*) to (.*)','How far is (.*) (.*) in (.*)','How far is (.*) (.*) to (.*)'], 'direct_message,direct_mention,mention', function(bot,message) {

    var value = message.match[1];
    var indexdist = message.match[2];
    var destdist = message.match[3];
    if(undefined === indexdist || '' === indexdist || null === indexdist)
    {
        bot.reply(message,"Source Index not added please type again!!");
    }
    else if(undefined === destdist || '' === destdist || null === destdist)
    {
        bot.reply(message,"Destination Index not added please type again!!");
    }
    else{
        if(undefined === value || '' === value || null === value)
        {
            bot.reply(message,"Conversion value not added so considering it as 1");
            value=1;    }

        var expander = new Map(); expander.set("in","inch"); expander.set("ft","foot"); expander.set("mm","millimeter"); expander.set("cm","centimeter"); expander.set("yd","yard");
        expander.set("mi","mile"); expander.set("cf","capefoot"); expander.set("rd","rod"); expander.set("ang","angstorm"); expander.set("n","nanometer");
        expander.set("micro","micron"); expander.set("m","meter"); expander.set("km","kilometer");
//Suggest users regarding light calculation

        function checkerandAbbre(n){
            if(n.length<3){
                return expander.has(n) ?  expander.get(n) : bot.reply(message, 'Such a metric '+n+' doesn\'t exist please try again');
            }
            else {
                if(n.startsWith('light')) return n;
                for (var value of expander.values()) {
                    if (value === n) {
                        return n;
                        break;
                    }
                }
                bot.reply(message, n.endsWith('s') ? 'Please try writing this '+n+' Metric as '+n.slice(0, -1) : 'Such a metric '+n+' doesn\'t exist please try again');
            }
        };
        if(checkerandAbbre(indexdist) !== undefined && checkerandAbbre(destdist) !== undefined){
            request("https://www.calculatorsoup.com/calculators/conversions/distance.php?input_value="+value+"&input="+checkerandAbbre(indexdist)+"&output="+checkerandAbbre(destdist)+"&action=solve",function(err,resp,body){
                var $=cheerio.load(body);
                var distval=$('div#answer').text();
                bot.reply(message, distval);

                if(value%2===0 && (indexdist.startsWith('light') && destdist.startsWith('light'))){
                    bot.reply(message, 'You can also do Astronomical Distance Calculation by typing light-day light-year light-hour light-minute');
                }
            });
        }
    }
});


controller.hears(['convert (.*) (.*) to (.*)','(.*) (.*) to (.*)', 'How much is (.*) (.*) in (.*)','How much is (.*) (.*) to (.*)'], 'direct_message,direct_mention,mention', function(bot,message) {

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
            val=1;    }

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
            bot.reply(message,"As of "+week[date.getDay()] +": "+ date.getDate() + "/" + date.getMonth() + 1 + "/" + date.getFullYear() +" and "+ date.getHours() + ":" + date.getMinutes() + ":" + sec);
            if($valx >=5000){
                bot.reply(message,val+" "+sourceval.toUpperCase()+" = "+$valx+" :money_mouth_face: "+destval.toUpperCase());
            }else if(val>5500){
                bot.reply(message,":moneybag:"+ val+" "+sourceval.toUpperCase()+" = "+$valx+" :money_with_wings:"+" "+destval.toUpperCase());}
            else{bot.reply(message,val+" "+sourceval.toUpperCase()+" = "+$valx +" "+destval.toUpperCase());}
        });
    }
});


controller.hears(['time in (.*)','day in (.*)','date in (.*)','utc of (.*)'], 'direct_message,direct_mention,mention', function(bot,message) {
    var timeloc = message.match[1];

    if(timeloc == undefined || timeloc === '' || timeloc === null)
    {
        bot.reply(message.text,"Location not added please type again!!");
    }

    request("https://time.is/"+timeloc.replace(" ","_"),function(err,resp,body){
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

        bot.reply(message,"Time in "+timeloc+" is "+timev.concat(secv));
        bot.reply(message,"Day, Date is "+dayv);
        bot.reply(message,"They follow: "+utcval);
    });
});

controller.hears(['Who created you', 'describe your creator', 'created by'], 'direct_message,direct_mention,mention', function(bot,message) {
    bot.reply(message,"I was Created by K. N. Dheeraj");
    bot.reply(message,"Backend Developer (Java, Node.js), React Learner, Automation Lover, Bot Creator and Fond of Data Analytics, ML, AI, NLP, Neural Networks and Deep Learning..");
    bot.reply(message,"Follow him on Twitter, Github and Linkedin: https://twitter.com/itsDheerajKn https://github.com/DheerajKN	https://www.linkedin.com/in/dheeraj-kn-878315106/");
});
