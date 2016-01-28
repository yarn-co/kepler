# Kepler
Your premier planet-finder

## Usage
```javascript
var Kepler = require('kepler');

var options = {
    width: 400,             // Defaults to 300
    baseUnit: 20,           // Defaults to 14
    mergePaths: true        // Defaults to false, merges paths by color
    fillGaps: true,         // Defaults to false, adds small glow to each trixel to fill subpixel gaps
    gradientBackground: ['rgb(0,0,0)', 'rgb(255,255,255)'],  // Defaults false, adds two-color horizontal gradient as a background
    square: true,           // Defaults to false, displays image as a square crop instead of a tight crop
    padding: 5,              // Defaults to 0, adds padding by percentage
    stickerSheet: {
        dpi: 600
    }
}

var SVG = Kepler({/* trixel data from api */}, options);

### Quantum2 branch:  What's needed for quantum cards currently
trixel-svg has passed the quantum card data and fonts.  After index.js makes the svg for the trixel, it calls makeQuantumCard like so:

if(options.quantumCard) {
       ourBestBabyGirl = makeItAQuantumCard(ourBestBabyBoy, options.quantumCardData);
       return ourBestBabyGirl;
}

The hack-iest thing in here is the way the fonts are served up.  They are ttf files with their own routes in trixel-svg, and they are applied by creating a style tag and adding in the code, as text that will be recognized by the browser upon rendering, that will fetch the served up fonts. Like so: 

 var style = document.createElement("style");
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

        newGirl.element._childNodes.push(style);

makeQuantumCard is just creating elements in the svg namespace, putting in the correct data, style and coordinates, and then appending to the trixel svg, like so:

        var name = document.createElement("text");
        name.innerHTML = cardData.name.toUpperCase();
        name.setAttribute("text-anchor", "middle");
        name.setAttribute("font-family", "Roboto Slab");
        name.setAttribute("font-size","20px");
        name.setAttribute("font-weght","bold");
        name.setAttribute("text-transform", "uppercase");
        name.setAttribute("x","0");


The messiest code to look at in makeQuantumCard is the code that deals with text wrapping, as there is no built in text wrap in SVG.  It involves a constant number of chars on each line, figuring out how many chars are in the power description, and using a for loop to do the math and add the appropriate number of tspan elements.  Like so:

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
          console.log("Buildin' them power lines!");
          for(var i=0;i < words.length; i++) {
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

TODO:
    -Apply the same logic for wrapping text in multi line card names as exists for multi line powers.
    -Nail down the bottom margin of the power for layouts 2 and 3.  It can differ by around 4 or 5 pixels with different numbers of           lines.
It's been an honor!  I hope to work with you guys again soon.
    
/*
 * SVG.file holds the SVG file as a string
 * SVG.element holds a structured XML representation of the SVG
 */
```
