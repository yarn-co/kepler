// Setup headers for journey thru space!

var nl = "";
var version = require('../package.json').version;
var header = '<?xml version="1.0" encoding="utf-8"?>' + nl +
         '<!-- Generator: Kepler-Triforce '+version+', powered by Trixel.io. http://trixel.io -->' + nl +
         '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' + nl + nl;

    
module.exports = header;
