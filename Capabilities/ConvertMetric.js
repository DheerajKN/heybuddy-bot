const convert = require('convert-units');
module.exports = function highmetric(controller) {

    controller.hears(['change (\\d+) (.*) into (.*)', 'map (\\d+) (.*) into (.*)'], 'direct_message,direct_mention,mention', function (bot, message) {

        let value = message.match[1];
        let source = message.match[2];
        let dest = message.match[3];

        if (undefined === source || '' === source || null === source) {
            bot.reply(message, "Source Index not added please type again!!");
        }
        else if (undefined === dest || '' === dest || null === dest) {
            bot.reply(message, "Destination Index not added please type again!!");
        }
        else {
            if (undefined === value || '' === value || null === value) {
                bot.reply(message, "Conversion value not added so considering as 1");
                value = 1;
            }

        const length = {'mm': 'millimeter', 'cm': 'centimeter', 'm': 'meter', 'in': 'inch', 'ft': 'foot', 'fathom': 'fathom','mi': 'mile', 'km': 'kilometer'};

        const area = {"mm2": "squaremillimeter", "cm2": "squarecentimeter", "m2": "squaremeter", "ha": "hectare", "km2": "squarekilometer",
        "in2": "squareinch", "ft2": "squarefeet", "ac": "acre", "mi2": "squaremile"};

        const mass = {"mcg": "microgram", "mg": "milligram", "g": "gram", "kg": "kilogram", "oz": "ounce", "lb": "pound", "t": "ton"};

        const volume = {"mm3": "cublicmillimeter", "cm3": "cubiccentimeter", "ml": "milliliter", "l": "liter", "kl": "kiloliter", "m3": "cubicmeter",
        "km3": "cubickilometer", "tsp": "teaspoon", "Tbs": "tablespoon", "in3": "cubicinch", "fl-oz": "fluidounce", "cup": "cup", "pnt": "pint",
        "gal": "gallon", "ft3": "cubicfoot", "yd3": "cubicyard"};

        const temp = {'C':'celisus', 'F': 'fahrenheit', 'K': 'kelvin', 'R':'Rankine'};

        const time = {"ns": "nanosecond", "ms": "millisecond", "s": "second", "min": "minute", "h": "hour", "d": "day", "week": "week", "month": "month", "year": "year"};

        const frequency = {"Hz": "hertz", "mHz": "millihertz", "kHz": "kilohertz", "MHz": "megahertz", "GHz": "gigahertz", "THz": "terahertz",
        "rpm": "rpm"};

        const digital = { "b": "bit", "Kb": "kilobit", "Mb": "megabit", "Gb": "gigabit", "Tb": "terabit", "B": "bit", "KB": "kilobyte", "MB": "megabit",
            "GB": "gigabyte", "TB": "terabyte"};

        const speed = ["m/s", "km/h", "m/h", "knot", "ft/s"];

        const pressure = ["Pa", "hPa", "kPa", "MPa", "bar", "torr", "psi", "ksi"];


        function sre(n) {
            return n.endsWith('s') ? n.slice(0, -1).replace(/ +/g, "") : n.replace(/ +/g, "");
        }
        function getKeyByValue(object, value) {
            return Object.keys(object).find(key => object[key] === value);
        }
        function BotCall(val, sourceKey, destKey) {
            bot.reply(message,`${value} ${source} = ${convert(val).from(sourceKey).to(destKey)} ${dest}`);
        }
        function mapcheck(m, s) {
            for (const k in m) {
                if (m[k] === s) {
                    return true;
                }
            }
            return false;
        }
        function keyExists(object, key){
            return object.hasOwnProperty(key);
        }
        Object.prototype.getKeyByValue = function( value ) {
            for( const prop in this ) {
                if( this.hasOwnProperty( prop ) ) {
                    if( this[ prop ] === value )
                        return prop;
                }
            }
        };
        function destCheck(m, v, s, d) {
            if(keyExists(m,sre(d))){
                BotCall(v, s, sre(d));
            }
            else if(mapcheck(m, sre(d.toLowerCase()))){
                BotCall(v, s, m.getKeyByValue(sre(d.toLowerCase())));
            }
            else{
                bot.reply(message, 'Destination Metric doesn\'t exist or this metric isn\'t appropriate for this conversion, try again!');
            }
        }
        function checkerAndPrinter(val, s, d) {
            if(keyExists(length, sre(s))){
                destCheck(length, val, sre(s), d);
            }
            else if(mapcheck(length, sre(s.toLowerCase()))){
                destCheck(length, val,getKeyByValue(length, sre(s.toLowerCase())), d);
            }
            else if(keyExists(area, sre(s))){
                destCheck(area, val, sre(s), d);
            }
            else if(mapcheck(area, sre(s.toLowerCase()))){
                destCheck(area, val,getKeyByValue(area, sre(s.toLowerCase())), d);
            }
            else if(keyExists(mass, sre(s))){
                destCheck(mass, val, sre(s), d);
            }
            else if(mapcheck(mass, sre(s.toLowerCase()))){
                destCheck(mass, val,getKeyByValue(mass, sre(s.toLowerCase())), d);
            }
            else if(keyExists(volume, sre(s))){
                destCheck(volume, val, sre(s), d);
            }
            else if(mapcheck(volume, sre(s.toLowerCase()))){
                destCheck(volume, val,getKeyByValue(volume, sre(s.toLowerCase())), d);
            }
            else if(keyExists(temp, sre(s))){
                destCheck(temp, val, sre(s), d);
            }
            else if(mapcheck(temp, sre(s.toLowerCase()))){
                destCheck(temp, val,getKeyByValue(temp, sre(s.toLowerCase())), d);
            }
            else if(keyExists(time, s)){
                destCheck(time, val, s, d);
            }
            else if(mapcheck(time, s.toLowerCase())){
                destCheck(time, val,getKeyByValue(time, s.toLowerCase()), d);
            }
            else if(keyExists(frequency, sre(s))){
                destCheck(frequency, val, sre(s), d);
            }
            else if(mapcheck(frequency, sre(s.toLowerCase()))){
                destCheck(frequency, val,getKeyByValue(frequency, sre(s.toLowerCase())), d);
            }
            else if(keyExists(digital, sre(s))){
                destCheck(digital, val, sre(s), d);
            }
            else if(mapcheck(digital, sre(s.toLowerCase()))){
                destCheck(digital, val,getKeyByValue(digital, sre(s.toLowerCase())), d);
            }
            else if(speed.includes(s)){
               if (speed.includes(d)){
                   BotCall(val,s,d);
               }
            }
            else if(pressure.includes(sre(s))){
                if (pressure.includes(sre(d))){
                    BotCall(val,sre(s), sre(d));
                }
            }
            else{
                bot.reply(message, 'Source Metric doesn\'t exist, try using NIST / ISO unit writing standards!');
            }
        }
        checkerAndPrinter(value, source, dest);
    }
    });
};
