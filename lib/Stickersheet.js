var Document = require('html-document/lib/Document').Document;
var _ = require('lodash');

var Stickersheet = module.exports = function(trixel) {
    
    // Our fake HTML document
    var document = new Document();

    var pageWidth = 8.5; // Assumed to be inches
    var pageHeight = 11;
    var dpi = 100;
    var pageWidthPx = pageWidth * dpi;
    var pageHeightPx = pageHeight * dpi;
    
    var svgContainer = document.createElement("svg");
    svgContainer.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgContainer.setAttribute("version", "1.1");
    svgContainer.setAttribute("style", "width: "+pageWidthPx+"px; height: "+pageHeightPx+"px;");
    
    var trixels = {
        t1: {},
        t2: {},
        t3: {},
        t4: {},
        t5: {},
        t6: {}
    }
    
    // Make it easier to grab values from the original trixel's viewBox
    var viewBoxTmp = trixel.element.getAttribute("viewBox");
    viewBoxTmp = viewBoxTmp.split(' ');
    var trixelViewBox = {
        x: viewBoxTmp[0],
        y: viewBoxTmp[1],
        width: viewBoxTmp[2],
        height: viewBoxTmp[3]
    }
    
    // lodash's _.clone() method returns empty object if given a DOM node,
    // even though these fake DOM nodes are of type Object
    
    // we don't need to specify the namespace on nested <svg>'s
    function dupTrixel() {
        var dupTrixel = document.createElement("svg");
        dupTrixel.innerHTML = trixel.element.innerHTML
        dupTrixel.setAttribute("viewBox", -trixelViewBox.width/2 + " " + -trixelViewBox.height/2 + " " + trixelViewBox.width + " " + trixelViewBox.height);
        dupTrixel.setAttribute("width", "200px");
        // dupTrixel.setAttribute("x", 500);
        return dupTrixel;
    }
    
    Object.keys(trixels).map(function(trixel) {
        trixels[trixel] = dupTrixel()
        svgContainer.appendChild(trixels[trixel]);
    });
    
    var nl = "";
    var version = require('../package.json').version;
    var header = '<?xml version="1.0" encoding="utf-8"?>' + nl +
             '<!-- Generator: Kepler-Triforce '+version+', powered by Trixel.io. http://trixel.io -->' + nl +
             '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' + nl + nl;
    
    var file =  header + svgContainer.outerHTML;


    return {
        element: svgContainer,
        file: file
    }

    return trixel;
}
