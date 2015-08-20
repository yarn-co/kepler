// Shim for html document
var Document = require('html-document/lib/Document').Document;
var KeplerHeader = require('./KeplerHTTPHeader');
var WorldBuilder = require('./WorldBuilder');

var internals = {};

var Compile = module.exports = function (options) {
      
      var width = options.width;
      var jsonData = options.data;
      
      if(options.stickerSheet) {
        var startLength = jsonData.length-1;
        
        var bleedLayerLength = 139; // trixels
        
        for(var i=1; i<bleedLayerLength; i++) {
          jsonData.push({
            index: startLength + i,
            color: "rgb(255,0,0)",
            opacity: 1
          });
        }
      }
      
      var BASE_UNIT = options.baseUnit;
      
      if(options.stickerSheet) {
        options.layers++; // For bleed edge
      }
      
      var Geometry = WorldBuilder.init(options.layers, BASE_UNIT);
      
      // TODO: THIS + 1 - 1 space odyssey has to stop
      var layersCount = options.layers + 1;
      
      return createSVG(width);
      
      /*======================= 
        
          utilities
            
      =======================*/ 
      
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
            
            if(options.stickerSheet) {
              printerCutline.setAttribute("style", "fill:none;stroke:#FF00FF;stroke-width:1");
            }
            Geometry.all.forEach(function(obj, key) {
              
              if(options.stickerSheet) {
                
                // Set the points for the printerCutline polygon
                if(key == 660) {
                  cutlinePoints += obj.v0.x * unitScale + "," + obj.v0.y * unitScale*-1 + " ";
                }
                
                if(key == 671) {
                  cutlinePoints += obj.v0.x * unitScale + "," + obj.v0.y * unitScale*-1 + " ";
                }
                
                if(key == 682) {
                  cutlinePoints += obj.v0.x * unitScale + "," + obj.v0.y * unitScale*-1 + " ";
                }
                
                if(key == 693) {
                  cutlinePoints += obj.v0.x * unitScale + "," + obj.v0.y * unitScale*-1 + " ";
                }
                
                if(key == 704) {
                  cutlinePoints += obj.v0.x * unitScale + "," + obj.v0.y * unitScale*-1 + " ";
                }
                
                if(key == 715) {
                  cutlinePoints += obj.v0.x * unitScale + "," + obj.v0.y * unitScale*-1;
                }
                
                // Triangles pointing away from center
                // on bleed layer: 726 - 791
                
                // Triangles pointing towards center
                // on bleed layer: 792 - 863
                
                // bleed layer is 726 - 863
                // layer before bleed layer is 599 - 725
                // These are the colors we care about: 659 - 725
                
                var startLength = jsonData.length-1;
                
                if(key > 658 && key < 726) {
                  // Bleed layer triangles pointing away from center
                  jsonData[key + 66].color = jsonData[key].color;
                }
                
                // The rest of these ranges are bleed layer triangles
                // pointing towards the center
                
                if(key == 660) {
                  // Color triangle on top corner, left side
                  jsonData[key + 132].color = jsonData[key].color;
                }
                
                if(key > 659 && key < 671) {
                  // Top left side
                  jsonData[key + 133].color = jsonData[key].color;
                }
                
                if(key > 670 && key < 682) {
                  // Left side
                  jsonData[key + 133].color = jsonData[key].color;
                }
                
                if(key === 681 || key === 682) {
                  // Colors for bottom left corner
                  jsonData[key + 134].color = jsonData[key].color;
                }
                
                if(key > 681 && key < 694) {
                  // Bottom left side
                  jsonData[key + 135].color = jsonData[key].color;
                }
                
                if(key > 691 && key < 704) {
                  // Bottom right side
                  jsonData[key + 135].color = jsonData[key].color;
                }
                
                if(key === 703 || key === 704) {
                  // Colors for bottom right corner
                  jsonData[key + 136].color = jsonData[key].color;
                }
                
                if(key > 702 && key < 715) {
                  // Right side
                  jsonData[key + 137].color = jsonData[key].color;
                }
                
                if(key > 714 && key < 726) {
                  // Top right side
                  jsonData[key + 137].color = jsonData[key].color;
                }
                
                if(key == 725) {
                  // Color triangle on top corner, right side
                  jsonData[key + 138].color = jsonData[key].color;
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
            
            if(options.stickerSheet) {
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
