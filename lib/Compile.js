// Shim for html document
var Document = require('html-document/lib/Document').Document;
var WorldBuilder = require('./WorldBuilder');

var internals = {};

var Compile = module.exports = function (options) {
    
      var width = options.width;
      var jsonData = options.data;
      var BASE_UNIT = options.baseUnit;
      
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

      // used to build the height as close as possible when teh height is not known
      function calcFullHeight(width) {
        
            var h = calcWidthOfTrixel();
            var s = h * (width / ( h * ( ( layersCount ) * 2) ) );
            
            // find the diference of the lengths
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
            var boxWidth = width;
            var boxHeight = calcFullHeight(width);
            
            // Our best baby boy
            var svgElem = document.createElement("svg");

            // Size/view
            svgElem.setAttribute("viewBox", -boxWidth/2 + " " + -boxHeight/2 + " " + boxWidth + " " + boxHeight);

            // SVG infos
            svgElem.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            svgElem.setAttribute("version", "1.1");
            
            // No background
            svgElem.setAttribute("style", 'background-color: rgba(0, 0, 0, 0);');
       
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
            Geometry.all.forEach(function(obj, key) {
                  
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
            
            // export file as string
            var nl = "";
            var version = require('../package.json').version;
            var header = '<?xml version="1.0" encoding="utf-8"?>' + nl +
             '<!-- Generator: Kepler-Triforce '+version+', powered by Trixel.io. http://trixel.io -->' + nl +
             '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' + nl + nl;
      
            var file =  header + svgElem.outerHTML;
            
            return {
              element: svgElem,
              file: file
            };

      }

} // makey()

internals.mergePathsByColor = function(parent) {
    
    var paths = parent.getElementsByTagName('path') || [];
    
    var joinedPaths = {};
    var path, colorKey;
    for (var i = 0; i < paths.length; i++) {
      
      path = paths[i];
      colorKey = path.getAttribute('style');
      
      // Append paths based on color key.
      if (joinedPaths[colorKey]) {
            joinedPaths[colorKey].setAttribute('d', joinedPaths[colorKey].getAttribute('d') + ' ' + path.getAttribute('d'))
            path.parentNode.removeChild(path);
      } else {
            joinedPaths[colorKey] = path;
      }
    
    }
    
}
