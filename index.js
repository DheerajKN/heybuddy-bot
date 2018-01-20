var Botkit = require('botkit')
var http= require('http')
var request=require('request')
var cheerio=require('cheerio')
var express= require('express')
var path=require('path')

var slackToken=process.env.SLACK_TOKEN

 var controller = Botkit.slackbot({
   debug: false
 })

 controller.spawn({
   token: slackToken

 }).startRTM(function(err,bot,payload) {
   if (err) {
    throw new Error('Could not connect to Slack')
  }
console.log('Connected to Slack')
})

controller.hears(['hello','Hi','What\'s up??'], 'direct_message,direct_mention,mention', function(bot,message) {
  bot.reply(message,'Hello there!! I\'m the Buddy bot who can help you in Weather and Currency Updates')
  bot.reply(message,'Strucked Up!! Message me Help to know more about functionalities')
});

controller.hears(['[H|h]elp','What can you do??'], 'direct_message,direct_mention,mention', function(bot,message) {
  bot.reply(message,'I can help you in Weather and Currency Updates by typing weather in <city> to know Weather Updates '+
  'and convert val <sourceCurrency> to <destinationCurrency> for currency updates')
});

controller.hears(['weather in (.*)', 'weather of (.*)','(.*)\'s weather','climate in (.*)','climate of (.*)','(.*)\'s climate'], 'direct_message,direct_mention,mention', function(bot,message) {
    var city = message.match[1]
    console.log("city: "+city)
    if(undefined === city || '' === city || null === city)
    {
        bot.reply(message.text,"Didn't you forgot the city name? I am really sorry, currently I can't guess your city.")
    }
    else{
        var options = {
            protocol : 'http:',
            host : 'api.openweathermap.org',
            path : '/data/2.5/weather?q='+city+'&appid=7bf212dface8e17114014161ddce3318',
            port : 80,
            method : 'GET'
          }

        var request = http.request(options, function(response){
            var body = ""
            response.on('data', function(data) {
                body += data
                weather = JSON.parse(body)
                var Temp= Math.round(weather.main.temp - 273.15) + ' °C'
                console.log("weather :" + weather.weather[0].main)
                msg="The Temp is "+ Temp + "and In " + city
                var reaction = ""
                switch(weather.weather[0].main)
                {
                        case "Clear":
                                bot.reply(message,msg+" it's Clear Sky")
                                reaction = "mostly_sunny"
                                bot.reply(message,":"+reaction+":")
                                bot.reply(message,"Its good idea to wear sunglasses before going out")
                                break
                        case "Clouds":
                        case "Cloud":
                                bot.reply(message,msg+" it's Raining")
                                reaction = "cloud"
                                bot.reply(message,":"+reaction+":")
                                break
                        case "Smoke":
                                bot.reply(message,msg+" it's Foggy")
                                reaction = "smoking"
                                bot.reply(message,":"+reaction+":")
                                bot.reply("Wear Proper Face Mask before leaving home")
                                break
                        case "Rain":
                                bot.reply(message,msg+" It's Raining")
                                reaction = "rain_cloud"
                                bot.reply(message,":"+reaction+":")
                                bot.reply(message,"Please carry umbrella if you are in " + city)
                                break
                        case "Thunderstorm":
                                bot.reply(message,msg+" It's gonna be Thunderous Rain")
                                reaction = "thunder_cloud_and_rain"
                                bot.reply(message,":"+reaction+":")
                                bot.reply(message,"Please don't go out if you are in " + city)
                                break
                        case "Drizzle":
                              bot.reply(message,msg+" It's Drizzling")
                              reaction = "partly_sunny_rain"
                              bot.reply(message,":"+reaction+":")
                              bot.reply(message,"Carry Umbrella it should be fine in " + city)
                              break
                        case "Haze":
                              bot.reply(message,"The Temp is "+ Temp)
                              reaction = "barely_sunny"
                              bot.reply(message,":"+reaction+":")
                              bot.reply(message,"There would be partly sunny in " + city)
                              break
                }
                bot.api.reactions.add({
                    timestamp: message.ts,
                    channel: message.channel,
                    name: reaction,
                }, function(err, res) {
                    if (err) {
                        bot.botkit.log('Failed to add emoji reaction :(', err)
                    }
                })
            })
            response.on('end', function() {
              /*res.send(JSON.parse(body)) */
            })
          })
          request.on('error', function(e) {
            console.log('Problem with request: ' + e.message)
            bot.reply(message, "sorry, couldn't find weather info for city " + city)
          })
          request.end()
  }
});

controller.hears(['convert (.*) (.*) to (.*)','(.*) (.*) to (.*)', 'How much is (.*) (.*) in (.*)','How much is (.*) (.*) to (.*)'], 'direct_message,direct_mention,mention', function(bot,message) {

    var val = message.match[1]
    var sourceval = message.match[2]
    var destval = message.match[3]

    if(undefined === sourceval || '' === sourceval || null === sourceval)
    {
        bot.reply(message.text,"Source Index not added please type again!!")
    }
    else if(undefined === destval || '' === destval || null === destval)
    {
        bot.reply(message.text,"Destination Index not added please type again!!")
    }
    else{
      if(undefined === val || '' === val || null === val)
      {
          bot.reply(message.text,"Conversion value not added so considering as 1")
          val=1    }

        request("https://exchangerate.guru/"+sourceval.toLowerCase()+"/"+destval.toLowerCase()+"/"+val+"/",function(err,resp,body){
          var $=cheerio.load(body)
          var valx=$('.form-control').get(1)
          var $valx=$(valx).attr('value')
          var currentTime = new Date()
          var date = new Date()
        currentDate = date.getDate() /// hears improve
        month = date.getMonth() + 1
        year = date.getFullYear()

hour = date.getHours()
min  = date.getMinutes()
sec  = date.getSeconds()

var week = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
bot.reply(message,"As of "+week[date.getDay()] +": "+ currentDate + "/" + month + "/" + year+" and "+ hour + ":" + min + ":" + sec)
if($valx >=5000){
bot.reply(message,val+" "+sourceval.toUpperCase()+" = "+$valx+" :money_mouth_face: "+destval.toUpperCase())
}else if(val>5500){
bot.reply(message,":moneybag:"+ val+" "+sourceval.toUpperCase()+" = "+$valx+" :money_with_wings:"+" "+destval.toUpperCase())}
else{bot.reply(message,val+" "+sourceval.toUpperCase()+" = "+$valx +" "+destval.toUpperCase())}
}) }
});

controller.hears('time in (.*)', 'direct_message,direct_mention,mention', function(bot,message) {
  var timeloc = message.match[1]

  if(undefined === timeloc || '' === timeloc || null === timeloc)
  {
      bot.reply(message.text,"Location not added please type again!!")
  }

      request("https://www.timeanddate.com/worldclock/?query="+timeloc.toLowerCase(),function(err,resp,body){
        var $=cheerio.load(body)
        var timeval=$('td#p0.rbi')
        var time =timeval.text()
console.log(time)
        bot.reply(message,"Day and Time in "+timeloc+" is: "+time)
      })
});
