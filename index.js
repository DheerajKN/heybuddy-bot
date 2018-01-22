var Botkit = require('botkit')
var http= require('http')
var request=require('request')
var cheerio=require('cheerio')

var slackToken=process.env.SLACK_TOKEN
var OpenweatherToken=process.env.OPENWEATHER_TOKEN

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
   bot.reply(message,'I can help you in Weather and Currency Updates')
   bot.reply(message,'by typing weather in <city> to know Weather Updates ')
   bot.reply(message,'convert val <sourceCurrency> to <destinationCurrency> for currency updates')
   bot.reply(message,'Time in <city> to get their present Day, Date, Time and UTC information')
});

controller.hears(['weather in (.*)', 'weather of (.*)','(.*)\'s weather','climate in (.*)','climate of (.*)','(.*)\'s climate'], 'direct_message,direct_mention,mention', function(bot,message) {
    var city = message.match[1]
    console.log("city: "+city)
    if(undefined === city || '' === city || null === city)
    {
        bot.reply(message,"Didn't you forgot the city name? I am really sorry, currently I can't guess your city.")
    }
    else{
        var options = {
            protocol : 'http:',
            host : 'api.openweathermap.org',
            path : '/data/2.5/weather?q='+city.replace(" ","+")+'&appid='+OpenweatherToken,
            port : 80,
            method : 'GET'
          }

        var request = http.request(options, function(response){
            var body = ""
            response.on('data', function(data) {
                body += data
                weather = JSON.parse(body)
                var Temp= Math.round(weather.main.temp - 273.15) + '°C '
                console.log("weather: " + weather.weather[0].main)
                msg="The Temp is "+ Temp + "and In " + city
                switch(weather.weather[0].main)
                {
                        case "Clear":
                                bot.reply(message,msg+" it's Clear Sky")
                                bot.reply(message,":mostly_sunny:")
                                bot.reply(message,"Its good idea to wear sunglasses before going out")
                                break
                        case "Clouds":
                        case "Cloud":
                                bot.reply(message,msg+" it's Raining")
                                bot.reply(message,":cloud:")
                                bot.reply(message,"Better to carry an Umbrella")
                                break
                        case "Smoke":
                                bot.reply(message,msg+" it's Foggy")
                                bot.reply(message,":smoking:")
                                bot.reply("Wear Proper Face Mask before leaving home")
                                break
                        case "Rain":
                                bot.reply(message,msg+" It's Raining")
                                bot.reply(message,":rain_cloud:")
                                bot.reply(message,"Please carry umbrella if you are in " + city)
                                break
                        case "Thunderstorm":
                                bot.reply(message,msg+" It's gonna be Thunderous Rain")
                                bot.reply(message,":thunder_cloud_and_rain:")
                                bot.reply(message,"Please don't go out if you are in " + city)
                                break
                        case "Drizzle":
                              bot.reply(message,msg+" It's Drizzling")
                              bot.reply(message,":partly_sunny_rain:")
                              bot.reply(message,"Carry Umbrella it should be fine in " + city)
                              break
                        case "Haze":
                              bot.reply(message,"The Temp is "+ Temp)
                              bot.reply(message,":barely_sunny:")
                              bot.reply(message,"There would be partly sunny in " + city)
                              break
                        case "Snow":
                              bot.reply(message,"The Temp is "+Temp)
                              bot.reply(message,":snow_cloud: :snowman:")
                              bot.reply(message,"Please wear Warm clothes those living in " + city)
                              break
                }
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
        bot.reply(message,"Source Index not added please type again!!")
    }
    else if(undefined === destval || '' === destval || null === destval)
    {
        bot.reply(message,"Destination Index not added please type again!!")
    }
    else{
      if(undefined === val || '' === val || null === val)
      {
          bot.reply(message,"Conversion value not added so considering as 1")
          val=1    }

        request("https://exchangerate.guru/"+sourceval.toLowerCase()+"/"+destval.toLowerCase()+"/"+val+"/",function(err,resp,body){
          var $=cheerio.load(body)
          var valx=$('.form-control').get(1)
          var $valx=$(valx).attr('value')

          var date = new Date()

          sec  = date.getSeconds().toString()
if(parseInt(date.getHours())>11){
  sec=sec.concat(" PM")
}else{
  sec=sec.concat(" AM")
}
var week = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
bot.reply(message,"As of "+week[date.getDay()] +": "+ date.getDate() + "/" + date.getMonth() + 1 + "/" + date.getFullYear() +" and "+ date.getHours() + ":" + date.getMinutes() + ":" + sec)
if($valx >=5000){
bot.reply(message,val+" "+sourceval.toUpperCase()+" = "+$valx+" :money_mouth_face: "+destval.toUpperCase())
}else if(val>5500){
bot.reply(message,":moneybag:"+ val+" "+sourceval.toUpperCase()+" = "+$valx+" :money_with_wings:"+" "+destval.toUpperCase())}
else{bot.reply(message,val+" "+sourceval.toUpperCase()+" = "+$valx +" "+destval.toUpperCase())}
}) }
});

controller.hears(['time in (.*)','day in (.*)','date in (.*)','utc of (.*)'], 'direct_message,direct_mention,mention', function(bot,message) {
  var timeloc = message.match[1]

  if(timeloc == undefined || timeloc == '' || timeloc == null)
  {
      bot.reply(message.text,"Location not added please type again!!")
  }

  request("https://time.is/"+timeloc.replace(" ","_"),function(err,resp,body){
    var $=cheerio.load(body)

    var timev=$('div#twd').text()
    var secv=$('span#leaps.leap0').text()
    if(parseInt(timev.substring(0,timev.indexOf(':')))>11){
      secv=secv.concat(" PM")
    }else{
      secv=secv.concat(" AM")
    }

    var dayv=$('div#dd.w90.tr').text()

    var utcv=$('.keypoints ul li').get(0)
    var utcval=$(utcv).text()

bot.reply(message,"Time in "+timeloc+" is "+timev.concat(secv))
bot.reply(message,"Day, Date is "+dayv)
bot.reply(message,"They follow: "+utcval)

  })
});
