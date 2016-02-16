



/*===card generator==================== 
  
    Steps
    Create the SVG
    Pipe svg through quantum card generator
      
=======================*/ 


/*

var SVG_Object = createSVG(width);

var card = new QuantumCardGenerator(document, SVG_Object, {})
var card = new QuantumCardGenerator(SVG_Object, {})

*/



var Document = require('html-document/lib/Document').Document;
// var KeplerHeader = require('./KeplerHTTPHeader');



var QuantumCardGenerator = module.exports = function() {
  this.whatever = "marf";
}

QuantumCardGenerator.prototype = {

  constructor : QuantumCardGenerator,

  /*======================= 
    
      this creats the original basic card data
      we need to break up the arguments to feed in fonts sizes etc
      todo for later
      
      Previous readme : 
      SVG element, fill it with the data from options.quantumCardData (cardData), style it and position it,
      and append it to the master SVG element  
  =======================*/ 
  
  createCard : function(SVG_Object, cardData) {

    console.log("THERE IS BLEED LAYER STUFF IN HERE, IT MUST GO");

    // forcing true
    var options = {
      bleedLayer : true
    }

    var cardData = {
      land : 'land',
      qcost : 2,
      statMove: 2,
      statAttack : 4,
      statLife : 8,
      powerName : "tacos",
      powerDesc : "ehto~~~~~",
      layout : 9,
      name : "name like"


    }


    SVG_Object.element.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");

    var document = new Document();
  
    var style = document.createElement("style");


    /*
    rasterize.js, which trixel-svg uses to convert the premade SVGs into PDFs, doesn't like woff fonts, which are readily
    available through a URL.
    I'm putting in ttf fonts which are being served up by trixel-svg/index.js.  The font
    files can be found in trixel-svg/styles/fonts.

    NOTE ttf fonts are not web legal or browser compliant

    */ 
    style.innerHTML = "@font-face {\n" +
                      "\tfont-weight: 400;\n" +
                      "\tfont-style: normal;\n" +
                      "\tfont-family: 'Roboto Slab';\n" +
                      "\tsrc: url('http://0.0.0.0:3007/styles/fonts/RobotoSlab-Regular.ttf');\n" +
                      "}\n" +
                      "\n"+
                      "text {\n"+
                      "\tstroke: none;\n"+
                      "\tfill: white;\n"+
                      "}\n" +
                      "\n" +
                      "@font-face {\n" +
                      "\tfont-weight: 700;\n" +
                      "\tfont-style: bold;\n" +
                      "\tfont-family: 'Roboto Slab Bold';\n" +
                      "\tsrc: url('http://0.0.0.0:3007/styles/fonts/RobotoSlab-Bold.ttf');\n" +
                      "}\n" +
                      "\n"+
                      "text {\n"+
                      "\tstroke: none;\n"+
                      "\tfill: white;\n"+
                      "}\n";

    SVG_Object.element._childNodes.push(style);

    // The hexagons are drawn, not imported.
    // ????????

    // this can be refactored
    var polyUp = document.createElement("polygon");

    polyUp.setAttribute("style","stroke:white;fill:none;stroke-width:1;");
    
    var ys = [-160, -152.75, -138.25, -131];

    /*======================= 
      
        THIS DOES NOT BELONG
        THIS SHOULD KNOW NOTHING OF THE THE BLEED LAYER
          
    =======================*/ 
    console.log("THIS DOES NOT BELONG THIS SHOULD KNOW NOTHING OF THE THE BLEED LAYER");

    if(options.bleedLayer) {
      for(var i = 0; i < ys.length; i++) {
        ys[i] += 17; // 17???? Arbitrary
      }
    }
    
    // Hard values.... grrrr
    polyUp.setAttribute("points","0,"+ys[0]+" 12.4096,"+ys[1]+" 12.4096,"+ys[2]+" 0,"+ys[3]+" -12.4096,"+ys[2]+" -12.4096,"+ys[1]+"");
    SVG_Object.element._childNodes.push(polyUp);

    var polyDown = document.createElement("polygon");
    polyDown.setAttribute("style","stroke:white;fill:none;stroke-width:1;");
    var ys = [160, 152.75, 138.25, 131];


    if(options.bleedLayer) {
      for(var i = 0; i < ys.length; i++) {
        ys[i] -= 16;
      }
    }

    polyDown.setAttribute("points","0,"+ys[0]+" 12.4096,"+ys[1]+" 12.4096,"+ys[2]+" 0,"+ys[3]+" -12.4096,"+ys[2]+" -12.4096,"+ys[1]+"");
    SVG_Object.element._childNodes.push(polyDown);

    var land = document.createElement("text");

    land.innerHTML = cardData.land.toUpperCase();
    
    land.setAttribute("text-anchor", "middle");
    
    var y = options.bleedLayer ? -36 : -41;
    
    land.setAttribute("y", y+"%");
    land.setAttribute("font-family", "Roboto Slab");
    land.setAttribute("font-size","10px");
    land.setAttribute("text-transform", "uppercase");
    
    SVG_Object.element._childNodes.push(land);

    var cost = document.createElement("text");
    cost.innerHTML = cardData.qcost;
    cost.setAttribute("text-anchor", "middle");
    
    var y = options.bleedLayer ? 38.7 : 43.4;
    
    cost.setAttribute("y", y+"%");
    cost.setAttribute("font-family", "Roboto Slab");
    cost.setAttribute("font-size","12px");
    cost.setAttribute("text-transform", "uppercase");
    
    SVG_Object.element._childNodes.push(cost); 


    var statY = options.bleedLayer ? -28 : -32.5;
    var move = document.createElement("text");

    var m = document.createElement("tspan");
    m.innerHTML = "M";
    m.setAttribute("font-family", "Roboto Slab");
    m.setAttribute("font-size", "12px");

    var mStat = document.createElement("tspan");
    mStat.innerHTML = cardData.statMove;
    mStat.setAttribute("font-family", "Roboto Slab Bold");
    mStat.setAttribute("font-size", "12px");

    var mX = cardData.statMove < 10 ? -32 : -38;
    move.setAttribute("x", mX);
    move.setAttribute("y", statY+"%");
    move.appendChild(m);
    move.appendChild(mStat);

    SVG_Object.element._childNodes.push(move);


    var atk = document.createElement("text");

    var a = document.createElement("tspan");
    a.innerHTML = "A";
    a.setAttribute("font-family", "Roboto Slab");
    a.setAttribute("font-size", "12px");

    var aStat = document.createElement("tspan");
    aStat.innerHTML = cardData.statAttack;
    aStat.setAttribute("font-family", "Roboto Slab Bold");
    aStat.setAttribute("font-size", "13px");

    atk.setAttribute("text-anchor", "middle");
    atk.setAttribute("y", statY+"%");
    atk.appendChild(a);
    atk.appendChild(aStat);

    SVG_Object.element._childNodes.push(atk);


    var life = document.createElement("text");

    var l = document.createElement("tspan");
    l.innerHTML = "L";
    l.setAttribute("font-family", "Roboto Slab");
    l.setAttribute("font-size", "12px");

    var lStat = document.createElement("tspan");
    lStat.innerHTML = cardData.statLife;
    lStat.setAttribute("font-family", "Roboto Slab Bold");
    lStat.setAttribute("font-size", "13px");

    var lX = cardData.statLife < 10 ? 15 : 15;

    life.setAttribute("x", lX);
    life.setAttribute("y", statY+"%");
    life.appendChild(l);
    life.appendChild(lStat);

    SVG_Object.element._childNodes.push(life);

    
    var power = document.createElement("text");

    var pTitle = document.createElement("tspan");
    pTitle.innerHTML = cardData.powerName + ":";
    
    var title = pTitle.innerHTML;
    
    var charsInTitle = title.length;
    
    pTitle.setAttribute("font-family", "Roboto Slab Bold");
    
    power.appendChild(pTitle);

    var firstLine = document.createElement("tspan");
    firstLine.setAttribute("font-family", "Roboto Slab");
 
    // Scripting in the line breaks after render doesn't work in PDF,
    // so I came up with this conf*ckery.  It's a little hacky, but
    // it works.
    var words = cardData.powerDesc.split(" ");
    var i = 0;
    var currentLine = 0;
    var linesNeeded = Math.ceil(cardData.powerDesc.length / 45);
    var lines = []; // An array to hold each line once it's been built.
    console.log("# of lines needed =", linesNeeded);
    lines[currentLine] = "";

    // And now we build.
    var len = words.length;
    for(var i=0;i < len; i++) {
      var currentWord = words[i];
      var charsInDesc = lines[currentLine].length; //We need to know the length of the line currently being built.
      var charsInWord = currentWord.length; // And the length of the next word, in advance.
      var totalChars;
      if (currentLine == 0) { // Need a special case for the first line because it includes the title.
        totalChars = charsInWord + charsInTitle + charsInDesc;
      } else {
        totalChars = charsInWord + charsInDesc;
      }
      if(totalChars <= 45) {
          lines[currentLine] = lines[currentLine] + " " + currentWord;
      } else {
        currentLine++;
        lines[currentLine] = currentWord ;
      }
    } 

    firstLine.innerHTML = lines[0]; 
    power.appendChild(firstLine);

    for(var i = 1; i < lines.length; i++) {
      var newLine = document.createElement("tspan");
      newLine.innerHTML = lines[i];
      newLine.setAttribute("text-anchor", "middle");
      newLine.setAttribute("dy", "14");
      newLine.setAttribute("x","0");
      newLine.setAttribute("font-family","Roboto Slab");
      power.appendChild(newLine);
    }

    power.setAttribute("text-anchor", "middle");

    var powY;
    if(cardData.layout > 1) {
      power.setAttribute("alignment-baseline","baseline");
      powY = 80 - (10 * (lines.length));
    } else {
      powY = -55;
    }

    power.setAttribute("y", powY);
    power.setAttribute("x", "0");
    power.setAttribute("font-size", "10px");
    power.setAttribute("width","250");
    power.setAttribute("id","power");

    SVG_Object.element._childNodes.push(power);

    // name needs to be added after power because its position depends on power's position in layout 3.
    var name = document.createElement("text");
    name.innerHTML = cardData.name.toUpperCase();
    name.setAttribute("text-anchor", "middle");
    name.setAttribute("font-family", "Roboto Slab");
    name.setAttribute("font-size","20px");
    name.setAttribute("font-weght","bold");
    name.setAttribute("text-transform", "uppercase");
    name.setAttribute("x","0");

    var nameY;
    if(cardData.layout == 3) {
      nameY = 80 - (10 * (lines.length + 1.5));
    } else {
      nameY = -70;
    }

    name.setAttribute("y", nameY);
    SVG_Object.element._childNodes.push(name);

// debugger
    // SVG_Object.file = KeplerHeader + SVG_Object.element.outerHTML;

    // return SVG_Object;

    return SVG_Object.element.outerHTML;
    // return SVG_Object;
  }


}
