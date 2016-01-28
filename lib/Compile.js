// Shim for html document
var Document = require('html-document/lib/Document').Document;
var KeplerHeader = require('./KeplerHTTPHeader');
var WorldBuilder = require('./WorldBuilder');

var internals = {};

var Compile = module.exports = function (options) {
      
      var width = options.width;
      var jsonData = options.data;
      
      var BASE_UNIT = options.baseUnit;
      
      // TODO: THIS + 1 - 1 space odyssey has to stop
      
      
      if(options.bleedLayer) {
        
        options.layers++; // +1 for iso-bleed!
        
        var startLength = jsonData.length-1;
        
        var bleedLayer = getLayerMetadata(options.layers);
        
        for(var i=1; i<bleedLayer.length; i++) {
          jsonData.push({
            index: startLength + i,
            color: "rgb(0,0,0)",
            opacity: 1
          });
        }
      }
      
      var layersCount = options.layers + 1;
      
      var Geometry = WorldBuilder.init(options.layers, BASE_UNIT);

      var ourBestBabyBoy = createSVG(width);

      // Read between the lines.
      if(options.quantumCard) {
       ourBestBabyGirl = makeItAQuantumCard(ourBestBabyBoy, options.quantumCardData);
       return ourBestBabyGirl;
      }
      
      return ourBestBabyBoy;
      
      /*======================= 
        
          utilities
            
      =======================*/ 
      
      /*
        This function returns an object with significant
        triangle indices n such organized into keys.
        
        Start, End trixels are inclusive.
        
        Indices correspond to jsonData and Geometry
      */
      function getLayerMetadata(layerNum) {
        
        function numTrianglesInLayer(layerNum) {
          
          var n = layerNum;
          return 6 * (n + (n-1));
        }
        
        function layerStartTriangle(layerNum) {
          
          startTrixel = 0;
          for(var i=1; i<=layerNum; i++) {
            startTrixel += numTrianglesInLayer(i);
          }
          
          return startTrixel;
        }
        
        /*
          For brevity's sake,
          
          s == start
          e == end
          
          outward == triangles pointing outward, away from the center
          inward == triangles pointing inward, towards the center
          
          + 2 for all the lengths to be inclusive of s && e
          
          The + 1 and - 1 shenanigans are to allow for s and e values
          to be inclusive
        */
        
        var layerStart = layerStartTriangle(layerNum);
        var layerEnd = layerStartTriangle(layerNum + 1) - 1;
        
        var outwardStart = layerStart;
        var outwardEnd = layerStart + (6 * (layerNum)) - 1;
        
        var inwardStart = outwardEnd + 1;
        var inwardEnd = layerEnd;
        
        var layerMeta = {
          
          s: layerStart,
          e: layerEnd,
          length: layerEnd - layerStart + 2,
          
          outward: {
            
            s: outwardStart,
            e: outwardEnd,
            sideLength: layerNum, // should be layerNum-1
            length: outwardEnd - outwardStart + 1
          },
          
          inward: {
            
            s: inwardStart,
            e: inwardEnd,
            sideLength: layerNum + 1, // should be layerNum
            length: inwardEnd - inwardStart + 1
          }
        }
        
        return layerMeta;
      }
      
      function randomRGB() {
        
          function z() {
            return Math.floor(Math.random()*255);
          }
          
          return 'rgb('+z()+','+z()+','+z()+')';
      }

      // used to calculate the width of a trixel, in triangle terms the altitude
      function calcWidthOfTrixel() {
            
            return h = 0.5 * Math.sqrt(3) * BASE_UNIT;
      }
      
      // used to find the scalar for the trixel to fit the stage
      function calcUnitScale(width, layersCount, direction) {
        
            var unit;
            
            if (direction === "height") {
                  
                  unit = BASE_UNIT;
            } else {
              
                  unit = calcWidthOfTrixel();
            }
            
            return width / ( unit * ( ( layersCount ) * 2) );
      }

      // used to build the height as close as possible when the height is not known
      function calcFullHeight(width) {
            
            var h = calcWidthOfTrixel();
            var s = h * (width / ( h * ( ( layersCount ) * 2) ) );
            
            // find the difference of the lengths
            var a = (2 / Math.sqrt(3) ) * s;
            return a * (layersCount * 2);
      }

      /* 
      I know this may not be the best solution, but it feels like I tried a hundred and this one works.
      I make an SVG element, fill it with the data from options.quantumCardData (cardData), style it and position it,
      and append it to the master SVG element (newGirl).
      */
      function makeItAQuantumCard(newGirl, cardData) {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        console.log("We makin' a card boys!");

        newGirl.element.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");

        var document = new Document();
    
        var style = document.createElement("style");


        /*
        rasterize.js, which trixel-svg uses to convert the premade SVGs into PDFs, doesn't like woff fonts, which are readily
        available through a URL.  I'm putting in ttf fonts which are being served up by trixel-svg/index.js.  The font
        files can be found in trixel-svg/styles/fonts.
        */ 
        console.log("Servin up them fonts, nice n' hot!");
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

        // The hexagons are drawn, not imported.
        console.log("Paintin' up them hexagons!");
        var polyUp = document.createElement("polygon");
        polyUp.setAttribute("style","stroke:white;fill:none;stroke-width:1;");
        var ys = [-160, -152.75, -138.25, -131];
        if(options.bleedLayer) {
          for(var i = 0; i < ys.length; i++) {
            ys[i] += 17;
          }
        }
        polyUp.setAttribute("points","0,"+ys[0]+" 12.4096,"+ys[1]+" 12.4096,"+ys[2]+" 0,"+ys[3]+" -12.4096,"+ys[2]+" -12.4096,"+ys[1]+"");
        newGirl.element._childNodes.push(polyUp);

        var polyDown = document.createElement("polygon");
        polyDown.setAttribute("style","stroke:white;fill:none;stroke-width:1;");
        var ys = [160, 152.75, 138.25, 131];
        if(options.bleedLayer) {
          for(var i = 0; i < ys.length; i++) {
            ys[i] -= 16;
          }
        }
        polyDown.setAttribute("points","0,"+ys[0]+" 12.4096,"+ys[1]+" 12.4096,"+ys[2]+" 0,"+ys[3]+" -12.4096,"+ys[2]+" -12.4096,"+ys[1]+"");
        newGirl.element._childNodes.push(polyDown);

        console.log("Findin' out where she from...")
        var land = document.createElement("text");
        land.innerHTML = cardData.land.toUpperCase();
        land.setAttribute("text-anchor", "middle");
        var y = options.bleedLayer ? -36 : -41;
        land.setAttribute("y", y+"%");
        land.setAttribute("font-family", "Roboto Slab");
        land.setAttribute("font-size","10px");
        land.setAttribute("text-transform", "uppercase");
        newGirl.element._childNodes.push(land);

        console.log("Seein' if she a gold digger...");
        var cost = document.createElement("text");
        cost.innerHTML = cardData.qcost;
        cost.setAttribute("text-anchor", "middle");
        var y = options.bleedLayer ? 38.7 : 43.4;
        cost.setAttribute("y", y+"%");
        cost.setAttribute("font-family", "Roboto Slab");
        cost.setAttribute("font-size","12px");
        cost.setAttribute("text-transform", "uppercase");
        newGirl.element._childNodes.push(cost); 


        console.log("Gettin' 'er numbers...");
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
        newGirl.element._childNodes.push(move);


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
        newGirl.element._childNodes.push(atk);


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
        newGirl.element._childNodes.push(life);

        
        console.log("Askin' 'er what she does for a livin'...");
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
        newGirl.element._childNodes.push(power);

        // name needs to be added after power because its position depends on power's position in layout 3.
        console.log("Gettin 'er name...");
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
        newGirl.element._childNodes.push(name);

        console.log("Fixin' 'er up...");
        newGirl.file = KeplerHeader + newGirl.element.outerHTML;

        console.log("Sendin' 'er off!  You treat 'er right, now!");
        console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
        return newGirl;
      }

      /*======================= 
        
          constructors
        
      =======================*/ 
      
      function createSVG(width) {
            
            // Our fake HTML document
            var document = new Document();
            
            // We need the nearest width at the start
            // This is just the width of the trixel itself

            var boxWidth = width;
            var boxHeight = calcFullHeight(width);
            
            var containerBoxWidth;
            var containerBoxHeight;
            
            containerBoxWidth = boxWidth;
            containerBoxHeight = boxHeight;
            
            if (options.square) {
              containerBoxWidth = containerBoxHeight;
            }
            
            if (options.padding) {
              containerBoxWidth  *= 1+(2*options.padding/100);
              containerBoxHeight *= 1+(2*options.padding/100);
            }
            
            // Our best baby boy
            var svgElem = document.createElement("svg");

            // Size/view
            svgElem.setAttribute("viewBox", -containerBoxWidth/2 + " " + -containerBoxHeight/2 + " " + containerBoxWidth + " " + containerBoxHeight);

            // SVG infos
            svgElem.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            svgElem.setAttribute("version", "1.1");
            
            // No background default
            svgElem.setAttribute("style", 'background-color: rgba(0, 0, 0, 0);');
       
            // Gradient background
            if (options.gradientBackground) {
              
              var linearGradient = document.createElement('linearGradient');
              linearGradient.setAttribute('id', 'g');
              
              var stop1 = document.createElement('stop');
              stop1.setAttribute('offset', '0%');
              stop1.setAttribute('style', 'stop-color:' + options.gradientBackground[0] + ';');
              
              var stop2 = document.createElement('stop');
              stop2.setAttribute('offset', '100%');
              stop2.setAttribute('style', 'stop-color:' + options.gradientBackground[1] + ';');
              
              linearGradient.appendChild(stop1);
              linearGradient.appendChild(stop2);
              
              svgElem.appendChild(linearGradient);
              
              var bg = document.createElement('rect');
              bg.setAttribute('x', -containerBoxWidth/2);
              bg.setAttribute('y', -containerBoxHeight/2);
              bg.setAttribute('width', containerBoxWidth);
              bg.setAttribute('height', containerBoxHeight);
              bg.setAttribute('fill', 'url(#g)');
              
              svgElem.appendChild(bg);
              
            }
       
            // Filter, etc to fill gaps between trixels
            if (options.fillGaps) {
              
                // Make blurry filter
                var filter = document.createElement("filter");
                filter.setAttribute('id', 'f');
                
                var feBlur = document.createElement('feGaussianBlur');
                feBlur.setAttribute('stdDeviation', '.2');
                
                filter.appendChild(feBlur);
                
                svgElem.appendChild(filter);
                
                // Create blurry group to which we can apply the filter
                var groupElemGap = document.createElement("g");
                groupElemGap.setAttribute('filter', 'url(#f)');
                svgElem.appendChild(groupElemGap);           
            }
            
            // Add group for main trixel pieces
            var groupElem = document.createElement("g");
            svgElem.appendChild(groupElem);  
            
            // original height / calculated height of all trixels in a row top to bottom
            // var unitScale = unit || boxHeight / ( Triforce.trixelUnit * ( (Triforce.DNA.amountOfLayers - 1) * 2) );
            var unitScale = calcUnitScale(boxWidth, layersCount);
            var styles;
            var opacity;
            var path;
            
            //var printerCutLineGroup = document.createElement("g");
            
            var printerCutline = document.createElement("polygon");
            var cutlinePoints = "";
            
            if(options.bleedLayer) {
              printerCutline.setAttribute("style", "fill:none;stroke:#FF00FF;stroke-width:1");
            }
            
            Geometry.all.forEach(function(obj, key) {
              
              if(options.bleedLayer) {
                
                // bleed layer
                var bl = getLayerMetadata(layersCount - 1);
                
                // outside layer
                var ol = getLayerMetadata(layersCount - 2);
                
                
                // Set the points for the printerCutline polygon
                
                var sideLength = ol.inward.sideLength;
                
                if(key == ol.inward.s) {
                  cutlinePoints += obj.v0.x * unitScale + "," + obj.v0.y * unitScale*-1 + " ";
                }
                
                if(key == ol.inward.s + sideLength) {
                  cutlinePoints += obj.v0.x * unitScale + "," + obj.v0.y * unitScale*-1 + " ";
                }
                
                if(key == ol.inward.s + sideLength * 2) {
                  cutlinePoints += obj.v0.x * unitScale + "," + obj.v0.y * unitScale*-1 + " ";
                }
                
                if(key == ol.inward.s + sideLength * 3) {
                  cutlinePoints += obj.v0.x * unitScale + "," + obj.v0.y * unitScale*-1 + " ";
                }
                
                if(key == ol.inward.s + sideLength * 4) {
                  cutlinePoints += obj.v0.x * unitScale + "," + obj.v0.y * unitScale*-1 + " ";
                }
                
                if(key == ol.inward.s + sideLength * 5) {
                  cutlinePoints += obj.v0.x * unitScale + "," + obj.v0.y * unitScale*-1;
                }
                
                
                // Copy the color info from the outside layer to the bleed layer
                // in an isometric pattern
                
                if(key >= ol.inward.s && key <= ol.inward.e) {
                  jsonData[key + ol.inward.length].color = jsonData[key].color;
                }
                
                var bleedOffset = ol.inward.length + bl.outward.length;
                var olSideLength = ol.inward.sideLength;
                
                if(key == ol.inward.s) {
                  // Color triangle on top corner, left side
                  jsonData[key + bleedOffset].color = jsonData[key].color;
                }
                
                if(key >= ol.inward.s && key < ol.inward.s + olSideLength) {
                  // Top left side
                  jsonData[key + bleedOffset + 1].color = jsonData[key].color;
                }
                
                if(key >= ol.inward.s + ol.inward.sideLength && key < ol.inward.s + ol.inward.sideLength * 2) {
                  // Left side
                  jsonData[key + bleedOffset + 1].color = jsonData[key].color;
                }
                
                if(key === ol.inward.s + ol.inward.sideLength * 2 - 1 || key === ol.inward.s + ol.inward.sideLength * 2) {
                  // Colors for bottom left corner
                  jsonData[key + bleedOffset + 2].color = jsonData[key].color;
                }
                
                if(key >= ol.inward.s + ol.inward.sideLength * 2 && key < ol.inward.s + ol.inward.sideLength * 3) {
                  // Bottom left side
                  jsonData[key + bleedOffset + 3].color = jsonData[key].color;
                }
                
                if(key >= ol.inward.s + ol.inward.sideLength * 3 && key < ol.inward.s + ol.inward.sideLength * 4) {
                  // Bottom right side
                  jsonData[key + bleedOffset + 3].color = jsonData[key].color;
                }
                
                if(key === ol.inward.s + ol.inward.sideLength * 4 - 1 || key === ol.inward.s + ol.inward.sideLength * 4) {
                  // Colors for bottom right corner
                  jsonData[key + bleedOffset + 4].color = jsonData[key].color;
                }
                
                if(key >= ol.inward.s + ol.inward.sideLength * 4 && key < ol.inward.s + ol.inward.sideLength * 5) {
                  // Right side
                  jsonData[key + bleedOffset + 5].color = jsonData[key].color;
                }
                
                if(key >= ol.inward.s + ol.inward.sideLength * 5 && key < ol.inward.s + ol.inward.sideLength * 6) {
                  // Top right side
                  jsonData[key + bleedOffset + 5].color = jsonData[key].color;
                }
                
                if(key == ol.inward.s + ol.inward.sideLength * 6 - 1) {
                  // Color triangle on top corner, right side
                  jsonData[key + bleedOffset + 6].color = jsonData[key].color;
                }
              } // end iso-bleed
              
              styles = '';
              path  = document.createElement("path");
              
              // Theres an issue with Y being flipped, maybe to do with viewBox so * -1 seems to work fancy like!
              // Create one trixel
              path.setAttribute('d', 'M ' + obj.v0.x * unitScale + ' '+ (obj.v0.y * unitScale)*-1 +'  L ' + obj.v1.x * unitScale + ' '+ (obj.v1.y * unitScale)*-1 +' L ' + obj.v2.x * unitScale + ' '+ (obj.v2.y * unitScale)*-1 +'z');
              
              // Pulling the color from the JSON data
              if (jsonData[key]) {
                
                  if (typeof jsonData[key].color !== 'undefined') {
                    styles += 'fill:'+jsonData[key].color+';';
                  }
                  
                  if (typeof jsonData[key].opacity !== 'undefined' && jsonData[key].opacity != 1) {
                    styles += 'fill-opacity:'+jsonData[key].color+';';
                  }
                  
                  path.setAttribute('style',  styles);
              } else {
                path.setAttribute('style',  'fill:'+randomRGB()+';');
              }
              
              groupElem.appendChild(path);
              
            });
            
            if(options.bleedLayer) {
              printerCutline.setAttribute("points", cutlinePoints);
              svgElem.appendChild(printerCutline);
            }
            
            if (options.mergePaths) {
                internals.mergePathsByColor(groupElem);
            }
            
            // If filling gaps, clone paths into the blurry group
            if (options.fillGaps) {
              var childPath;
              var tmpPath;
              for (var i = 0; i < groupElem.children.length; i++) {
                    
                    childPath = groupElem.children[i];
                    tmpPath = document.createElement('path');
                    
                    tmpPath.setAttribute('d', childPath.getAttribute('d'));
                    tmpPath.setAttribute('style', childPath.getAttribute('style'));
                    
                    groupElemGap.appendChild(tmpPath);
              }
            }
            
            // Grab Kepler header from require
            var file = KeplerHeader + svgElem.outerHTML;
            
            return {
              element: svgElem,
              file: file
            };

      }

}; // makey()

internals.mergePathsByColor = function(parent) {
    
    var paths = parent.getElementsByTagName('path') || [];
    
    var joinedPaths = {};
    var path, colorKey;
    for (var i = 0; i < paths.length; i++) {
      
      path = paths[i];
      colorKey = path.getAttribute('style');
      
      // Append paths based on color key.
      if (joinedPaths[colorKey]) {
            joinedPaths[colorKey].setAttribute('d', joinedPaths[colorKey].getAttribute('d') + ' ' + path.getAttribute('d'));
            path.parentNode.removeChild(path);
      } else {
            joinedPaths[colorKey] = path;
      }
    
    }
    
};
