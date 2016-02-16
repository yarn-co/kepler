
/*======================= 
  
    Task: At this writing build an SVG or PDF grid based document for
    1 trixelViewer :apiID in a grid of 6 for distributing to the printing company.

    For later allow an array of :apiId's to fill in the sheet with unique stickers
    
    The grid is static, could use a slot based system or even nicer
    a circle packing formula


=======================*/ 


var Document = require('html-document/lib/Document').Document;
var KeplerHeader = require('./KeplerHTTPHeader');
var TrixelLogo = require('./trixelLogoSvg').logo;
var LogoWHRatio = require('./trixelLogoSvg').whRatio;
var _ = require('lodash');

var Stickersheet = module.exports = function(trixel, options) {
    
    // This stickersheet scales based on dpi. Normally the dpi would be 600
    // Though if the page isn't 8.5 / 11 inches, things need to be programmatically repositioned.

    // TODO: this needs to be logical rather then static or tweaked.
    // Needs conversion to MM
    
    // Our fake HTML document
    var document = new Document();
    
    var pageWidthInches = 9; // Assumed to be inches
    var pageHeightInches = 12; // Assumed to be inches

    // while 72 is a screen DPI its not representative of our
    // physical space, this should be converted to mm units
    // but for now, make it work during the Revision 2 rewrite
    var dpi = options.dpi || 72;

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
    };
    
    // Get filter from trixel
    var trixelFilter = trixel.element.getElementById("f");
    trixel.element.removeChild(trixelFilter);
    
    // Make it easier to grab values from the original trixel's viewBox
    var viewBoxTmp = trixel.element.getAttribute("viewBox");
    viewBoxTmp = viewBoxTmp.split(' ');
    var trixelViewBox = {
        x: viewBoxTmp[0],
        y: viewBoxTmp[1],
        width: viewBoxTmp[2],
        height: viewBoxTmp[3]
    };
    
    var trixelWHratio = trixelViewBox.width / trixelViewBox.height;
    var trixelWidth = pageWidth * 0.366; // Best guess based on mockup
    var trixelHeight = trixelWidth / trixelWHratio;
    
    function dupTrixel() {
        
        // Bleed == 1/16"
        // TrixelWidth at 0.366% of 9" == 3.294"
        // 3.294" - 0.125" (0.0625 * 2 for 2 bleed edges) == 3.169"
        // So inner trixel size is 96.205222% of the outer trixel size
        // seems brittle
        var innerTrxlScale = 0.96205222;
        
        var dupTrxl = document.createElement("svg");
        
        dupTrxl.innerHTML = trixel.element.innerHTML;
        
        dupTrxl.setAttribute("viewBox", trixel.element.getAttribute("viewBox"));
        
        dupTrxl.setAttribute("width", trixelWidth);
        
        // dupTrxlGroup.appendChild(dupTrxlInner);
        return dupTrxl;
    }
    
    svgContainer.appendChild(trixelFilter);
    Object.keys(trixels).map(function(trxl) {
        trixels[trxl] = dupTrixel();
        svgContainer.appendChild(trixels[trxl]);
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
        The layout is like this so I can set the X val of t4 based off of t3's X val,
        keeping t3's x value "trixelPageMargin"px away from the edge.
    */
    
    var marginBetweenTrixels = pageWidth * 0.0248; // Best guess based on mockup
    var trixelPageMargin = pageWidth * 0.024; // Best guess based on mockup
    var rowOffset = pageHeight * 0.255;
    
    // This is in case sliders are wanted in the future to interactively adjust values
    if(typeof options.spacing != 'undefined') {
        marginBetweenTrixels = options.spacing.marginBetweenTrixels;
        trixelPageMargin = options.spacing.trixelPageMargin;
        rowOffset = options.spacing.rowOffset;
    }
    
    
    var t1X = trixelPageMargin;
    var t1Y = -pageHeight/2 + trixelHeight/2 + trixelPageMargin;
    trixels.t1.setAttribute("x", t1X);
    trixels.t1.setAttribute("y", t1Y);

    trixels.t2.setAttribute("x", t1X + trixelWidth + marginBetweenTrixels);
    trixels.t2.setAttribute("y", t1Y);

    var t3X = pageWidth - trixelWidth - trixelPageMargin;
    var t3Y = t1Y + rowOffset;
    trixels.t3.setAttribute("x", t3X);
    trixels.t3.setAttribute("y", t3Y);

    trixels.t4.setAttribute("x", t3X - trixelWidth - marginBetweenTrixels);
    trixels.t4.setAttribute("y", t3Y);

    var t5X = t1X;
    var t5Y = t3Y + rowOffset;

    trixels.t5.setAttribute("x", t5X);
    trixels.t5.setAttribute("y", t5Y);

    trixels.t6.setAttribute("x", t5X + trixelWidth + marginBetweenTrixels);
    trixels.t6.setAttribute("y", t5Y);
    

    // And now the Trixel.io logo

    svgContainer.appendChild(TrixelLogo);

    var logoWidth = pageWidth * 0.25; // Best guess based on mockup
    var logoHeight = logoWidth / LogoWHRatio; // LogoWHRatio imported from trixelLogoSvg.js
    var logoRightMargin = pageWidth * 0.04; // Best guess based on mockup
    var logoBottomMargin = pageHeight * 0.04; // Best guess based on mockup
    
    TrixelLogo.setAttribute("width", logoWidth);
    TrixelLogo.setAttribute("x", pageWidth - logoWidth - logoRightMargin);
    TrixelLogo.setAttribute("y", pageHeight/2 - logoHeight - logoBottomMargin);


    // Grab Kepler header from require
    var file = KeplerHeader + svgContainer.outerHTML;


    return {
        element: svgContainer,
        file: file
    };

};
