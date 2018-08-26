module.exports=function translate(controller){
  controller.hears(['translate (.*) from (.*) to (.*)','translate (.*) to (.*)'], 'direct_message,direct_mention,mention', function(bot,message) {
      const translate = require('google-translate-api');
    var langs = {
    'auto': 'Automatic','af': 'Afrikaans','sq': 'Albanian','am': 'Amharic','ar': 'Arabic',
    'hy': 'Armenian','az': 'Azerbaijani','eu': 'Basque','be': 'Belarusian',
    'bn': 'Bengali','bs': 'Bosnian','bg': 'Bulgarian','ca': 'Catalan',
    'ceb': 'Cebuano','ny': 'Chichewa','zh-cn': 'Chinese Simplified','zh-tw': 'Chinese Traditional',
    'co': 'Corsican','hr': 'Croatian','cs': 'Czech','da': 'Danish','nl': 'Dutch','en': 'English','eo': 'Esperanto',
    'et': 'Estonian','tl': 'Filipino','fi': 'Finnish','fr': 'French','fy': 'Frisian','gl': 'Galician','ka': 'Georgian',
    'de': 'German','el': 'Greek','gu': 'Gujarati','ht': 'Haitian Creole','ha': 'Hausa','haw': 'Hawaiian','iw': 'Hebrew','hi': 'Hindi',
    'hmn': 'Hmong','hu': 'Hungarian','is': 'Icelandic','ig': 'Igbo','id': 'Indonesian','ga': 'Irish','it': 'Italian','ja': 'Japanese',
    'jw': 'Javanese','kn': 'Kannada','kk': 'Kazakh','km': 'Khmer','ko': 'Korean','ku': 'Kurdish (Kurmanji)','ky': 'Kyrgyz','lo': 'Lao',
    'la': 'Latin','lv': 'Latvian','lt': 'Lithuanian','lb': 'Luxembourgish','mk': 'Macedonian','mg': 'Malagasy','ms': 'Malay','ml': 'Malayalam',
    'mt': 'Maltese','mi': 'Maori','mr': 'Marathi','mn': 'Mongolian','my': 'Myanmar (Burmese)','ne': 'Nepali','no': 'Norwegian','ps': 'Pashto',
    'fa': 'Persian','pl': 'Polish','pt': 'Portuguese','ma': 'Punjabi','ro': 'Romanian','ru': 'Russian','sm': 'Samoan','gd': 'Scots Gaelic',
    'sr': 'Serbian','st': 'Sesotho','sn': 'Shona','sd': 'Sindhi','si': 'Sinhala','sk': 'Slovak','sl': 'Slovenian','so': 'Somali','es': 'Spanish',
    'su': 'Sundanese','sw': 'Swahili','sv': 'Swedish','tg': 'Tajik','ta': 'Tamil','te': 'Telugu','th': 'Thai','tr': 'Turkish','uk': 'Ukrainian',
    'ur': 'Urdu','uz': 'Uzbek','vi': 'Vietnamese','cy': 'Welsh','xh': 'Xhosa','yi': 'Yiddish','yo': 'Yoruba','zu': 'Zulu'
    };

    if (message.match[3]===undefined) {
      var value = message.match[1]
      var destlang = message.match[2]
      if (search(longer(destlang))) {
          trans(value,longer(destlang))
      } else {
          bot.reply(message,"We currently don't support the language you entered, Try Again!!")
      }
    }
    else if(message.match[3]!==undefined){
      var value = message.match[1]
      var sourcelang = message.match[2]
      var destlang = message.match[3]
      if (search(longer(sourcelang)) && search(longer(destlang))) {
        transwithsource(value,longer(sourcelang),longer(destlang))
      } else {
        bot.reply(message,"Languages entered are not supported now try with another languages")
      }
    }

    function longer(langcode){
      if (langcode.length<4) {
        if(langs.hasOwnProperty(langcode)){
          langcode = langs[langcode]
        } else {
          bot.reply(message, 'Such a Language code doesn\'t exist, Try Again!!');
        }
      }
      else if (langcode.includes("-")) {
        if (langcode.endsWith("cn") || langcode.endsWith("tw")) {
          langcode= langs[langcode.replace(/(.*)-/,'zh-')]
        }
      }
      else if (langcode.includes("hinese")){
        if (langcode.endsWith("implified")) { language= "Chinese Simplified" }
        else if (langcode.endsWith("raditional")) { langcode= "Chinese Traditional";}
        else{ langcode= "Chinese Simplified" }
      }

      return langcode.replace(
       /\w\S*/g,
       function(txt) {
           return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
       }
     );
    }

    function shorter(langcode){
      return Object.keys(langs).find(key => langs[key] === langcode);
    }

    function search(langcode){
      if (Object.values(langs).indexOf(langcode) > -1) {
        return true;
      } else{
       return false;
      }
    }

    function trans(val,dest){
      translate(val,{to: shorter(dest)}).then(res=>{
        if (res.text==='') {
          bot.reply(message,"Translation wasn't successful, Try with another word")
        }
        else if (res.from.text.autoCorrected===true) {
          bot.reply(message,`${res.from.text.value} in ${longer(res.from.language.iso)} to ${dest} is *${res.text}*`)
        }
        else {
           if (res.from.language.iso === '') {
             bot.reply(message,`${val} to ${dest} is *${res.text}*`)
              }
              else {
                bot.reply(message,`${val} in ${longer(res.from.language.iso)} to ${dest} is *${res.text}*`)
              }
            }
      }).catch(err =>{
        console.error(err)
      })
}
      function transwithsource(val, source, dest){
        translate(val,{from: shorter(source), to: shorter(dest)}).then(res=>{

          if (res.text==='') {
            bot.reply(message,"Translation wasn't successful, Try with another word")
          }
          else{
            if (res.from.text.autoCorrected===true){
              bot.reply(message,`${res.from.text.value} in ${source} to ${dest} is *${res.text}*`)
            }
            else{
                bot.reply(message,`${val} in ${source} to ${dest} is *${res.text}*`)
            }
          }
        }).catch(err =>{
          console.error(err)
        })
    }
  })
}
