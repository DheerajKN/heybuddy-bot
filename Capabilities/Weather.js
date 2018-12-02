module.exports = function weather(controller, request, OpenweatherToken, http){
controller.hears(['weather in (.*)', 'weather of (.*)','(.*)\'s weather'], 'direct_message,direct_mention,mention', function(bot,message) {
    var city = message.match[1];
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
                var msg="The Temp is "+ Temp + "and In " + city;
                switch(weather.weather[0].main)
                {
                    case "Clear":
                        bot.reply(message,`${msg} it's Clear Sky`);
                        bot.reply(message,":mostly_sunny:");
                        bot.reply(message,"Its good idea to wear sunglasses before going out");
                        break;
                    case "Clouds":
                    case "Cloud":
                        bot.reply(message,`${msg} it's Raining`);
                        bot.reply(message,":cloud:");
                        bot.reply(message,"Better to carry an Umbrella");
                        break;
                    case "Smoke":
                        bot.reply(message,`${msg} it's Foggy`);
                        bot.reply(message,":smoking:");
                        bot.reply("Wear Proper Face Mask before leaving home");
                        break;
                    case "Rain":
                        bot.reply(message,`${msg} It's Raining`);
                        bot.reply(message,":rain_cloud:");
                        bot.reply(message,`Please carry umbrella if you are in ${city}`);
                        break;
                    case "Thunderstorm":
                        bot.reply(message,`${msg} It's gonna Slackbe Thunderous Rain`);
                        bot.reply(message,":thunder_cloud_and_rain:");
                        bot.reply(message,`Please don't go out if you are in ${city}`);
                        break;
                    case "Drizzle":
                        bot.reply(message,`${msg} It's Drizzling`);
                        bot.reply(message,":partly_sunny_rain:");
                        bot.reply(message,`Carry Umbrella it should be fine in ${city}`);
                        break;
                    case "Haze":
                        bot.reply(message,`The Temp is ${Temp}`);
                        bot.reply(message,":barely_sunny:");
                        bot.reply(message,`There would be partly sunny in ${city}`);
                        break;
                    case "Snow":
                        bot.reply(message,`The Temp is ${Temp}`);
                        bot.reply(message,":snow_cloud: :snowman:");
                        bot.reply(message,`Please wear Warm clothes those living in ${city}`);
                        break;
                }
            });
            response.on('end', function() {
                /*res.send(JSON.parse(body)) */
            });
        });
        request.on('error', function(e) {
            console.log('Problem with request: ' + e.message);
            bot.reply(message, `sorry, couldn't find weather info for city ${city}`);
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
                bot.reply(message, `Quick Fact: ${city} is located at ${LongLatcheck(weather.coord.lat, 'lat')} and ${LongLatcheck(weather.coord.lon, 'lon')}`);
                bot.reply(message, `Temperature Varies from ${Math.round(weather.main.temp_min - 273.15)}°C  to ${Math.round(weather.main.temp_max - 273.15)} °C  at this place`);
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
}