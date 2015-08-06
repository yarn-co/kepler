var Document = require('html-document/lib/Document').Document;
var _ = require('lodash');

var Stickersheet = module.exports = function(trixel) {
    
    // This stickersheet scales based on dpi. Normally the dpi would be 600
    // Though if the page isn't 8.5 / 11 inches, things need to be programmatically repositioned.
    
    
    // Our fake HTML document
    var document = new Document();
    
    var pageWidthInches = 8.5; // Assumed to be inches
    var pageHeightInches = 11; // Assumed to be inches
    var dpi = 100; // Change to 600 for production or whatever the passed in dpi is (Passing in dpi not set up yet)
    var pageWidth = pageWidthInches * dpi;
    var pageHeight = pageHeightInches * dpi;
    
    var svgContainer = document.createElement("svg");
    svgContainer.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgContainer.setAttribute("version", "1.1");
    svgContainer.setAttribute("style", "width: "+pageWidth+"px; height: "+pageHeight+"px;");
    
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

    var trixelWHratio = trixelViewBox.width / trixelViewBox.height;
    
    var trixelWidth = pageWidth * .3622; // Best guess based on mockup
    var trixelHeight = trixelWidth / trixelWHratio;

    function dupTrixel() {
        // lodash's _.clone() method returns empty object if given a DOM node,
        // even though these fake DOM nodes are of type Object so we do this.
        var dupTrixel = document.createElement("svg");
        dupTrixel.innerHTML = trixel.element.innerHTML
        dupTrixel.setAttribute("viewBox", trixel.element.getAttribute("viewBox"));
        dupTrixel.setAttribute("width", trixelWidth);
        return dupTrixel;
    }
    
    Object.keys(trixels).map(function(trixel) {
        trixels[trixel] = dupTrixel()
        svgContainer.appendChild(trixels[trixel]);
    });

    /**          The interesting stuff: positioning things          **/
    
    /*
        Page layout:
        
        | t1 t2   |
        |   t4 t3 |
        | t5 t6   |
        |         |
          Trixel.io
        
        --
        The layout is like this so I can set the X val of t4 based off of t3's X val.
    */

    var paddingBetweenTrixels = pageWidth * .03; // Best guess based on mockup
    var paddingFromPageSides = pageWidth * .025; // Best guess based on mockup
    var paddingFromPageTop = pageWidth * .03; // Best guess based on mockup
    var rowOffset = pageHeight * .265;

    var t1X = paddingFromPageSides
    var t1Y = -pageHeight/2 + trixelHeight/2 + paddingFromPageTop;
    trixels.t1.setAttribute("x", t1X);
    trixels.t1.setAttribute("y", t1Y);

    trixels.t2.setAttribute("x", t1X + trixelWidth + paddingBetweenTrixels);
    trixels.t2.setAttribute("y", t1Y);

    var t3X = pageWidth - trixelWidth - paddingFromPageSides;
    var t3Y = t1Y + rowOffset; // Best guess based on mockup
    trixels.t3.setAttribute("x", t3X);
    trixels.t3.setAttribute("y", t3Y);

    trixels.t4.setAttribute("x", t3X - trixelWidth - paddingBetweenTrixels);
    trixels.t4.setAttribute("y", t3Y);

    var t5X = t1X;
    var t5Y = t3Y + rowOffset;

    trixels.t5.setAttribute("x", t5X);
    trixels.t5.setAttribute("y", t5Y);

    trixels.t6.setAttribute("x", t5X + trixelWidth + paddingBetweenTrixels);
    trixels.t6.setAttribute("y", t5Y);

    /**                             **                              **/



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

}
