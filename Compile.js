// Shim for html document
// TODO: make sure this wont memory leak by sharing the same document.
var Document = require('html-document/lib/Document').Document;

/*
compile(300,Triforce.V.layers,false,Kepler.WorldBuilder.world, JSONY);

level = 12
planet = Kepler.WorldBuilder.init( level ,14);
Kepler.Compile(300, level ,true, planet, JSONY);

*/

// Kepler.Compile = function (baseWidth,layersIn,SCALE_TYPE, TRIXELS_GEOMETRY, JSON_SOURCE, BASE_UNIT, DIV_WRAPPER) {
var Compile = module.exports = function (args) {

      var _args = {
        baseWidth : args.baseWidth,
        layersIn : args.layersIn,
        scaleType : args.scaleType,
        trixelsGeometry : args.trixelsGeometry,
        JSONSource : args.JSONSource,
        baseUnit : args.baseUnit,
        divWrapper : args.divWrapper
      }

      // var width = 600;
      // var height = 600;
      // var height;
      var widthHeight = args.baseWidth || 520;
      BASE_UNIT = args.baseUnit || 14;

      // DIV_WRAPPER = DIV_WRAPPER ||  false;

      // THIS + 1 - 1 space odyssey has to stop
      // var layersCount = layersIn + 1 || Triforce.DNA.amountOfLayers - 1;
      var layersCount = args.layersIn + 1;

      // var OUTPUT;
      TRIXELS_GEOMETRY = args.trixelsGeometry || Kepler.WorldBuilder.world;

      // if (typeof JSON_SOURCE !== 'undefined'){
      //   JSON_SOURCE = JSON.parse(JSON_SOURCE);
      // }

      return init();

      function init () {
          var svg = createSVG(widthHeight);

          if (_args.divWrapper) {
            createPlaceHolderDIV( svg.svgElement, svg.width, svg.height  );
          };
          return svg;      
      }
      /*======================= 
        
          utilitys
            
      =======================*/ 
      
      function randomRGB () {
          function z () {
            return Math.floor(Math.random()*255);
          }
          return 'rgb('+z()+','+z()+','+z()+')';
      }

      function recalcWidth (boxWidth, layersCount) {
            // we need the altitude "height" of the trixel from the known unit
            var h = 0.5 * Math.sqrt(3) * Triforce.trixelUnit;
            var b = boxWidth / ( Triforce.trixelUnit * ( ( layersCount ) * 2) );
            var x = h * b * ( ( layersCount ) * 2)
            return x;
            // v= document.querySelector('#svgbox');
            // v.style.width = x+'px';
      }

      // used to calculate the width of a trixel, in triangle terms the altitude
      function calcWidthOfTrixel () {
            // var unit = BASE_UNIT || 14;
            return h = 0.5 * Math.sqrt(3) * BASE_UNIT;
      }
      // used to find the scaler for the trixel to fit the stage
      function calcUnitScale (widthHeight,layersCount,Direction) {
            var unit;
            if (Direction === "height") {
                  // unit = Triforce.trixelUnit;
                  unit = BASE_UNIT
            }else{
                  unit = calcWidthOfTrixel();
            }
            // return widthHeight / ( unit * ( (Triforce.DNA.amountOfLayers - 1) * 2) );
            // original width / calculated width
            return widthHeight / ( unit * ( ( layersCount ) * 2) );
      }

      // used to build the full width of trixels after being scaled
      // Wait... The width is already known...
      function calcFullWidth (widthHeight) {
            var h = calcWidthOfTrixel();
            // get the scaled unit of the width
            var s = h * (widthHeight / ( h * ( ( layersCount ) * 2) ) );
            return s * (layersCount*2);
      }

      // used to build the height as close as possible when teh height is not known
      function calcFullHeight (widthHeight) {
            var h = calcWidthOfTrixel();
            var s = h * (widthHeight / ( h * ( ( layersCount ) * 2) ) )
            // find the diference of the lengths
            var a = (2 / Math.sqrt(3) ) * s;
            return a * (layersCount * 2);
      }

      /*======================= 
        
          constructors
            
      =======================*/ 
      
      function createSVG (widthHeight) {
            
            var document = new Document();
            
            var xmlns = "http://www.w3.org/2000/svg";

            // var boxHeight = 692.820323027551;
            // var boxHeight = height;
            // var boxWidth = width;//600
            // var boxWidth = widthHeight;//600

            // we need the nearest width at the start
            // var boxWidth = calcFullWidth( widthHeight );//600
            var boxWidth = widthHeight;
            var boxHeight = calcFullHeight( widthHeight );
            console.log("boxWidth : ", boxWidth, "boxHeight : ", boxHeight);

            

            var svgElem = document.createElement("svg");
            svgElem.setAttribute("viewBox", -boxWidth/2 + " " + -boxHeight/2 + " " + boxWidth + " " + boxHeight);

            // swap between fluid or not
            if (_args.scaleType) {
              svgElem.setAttribute("width", "100%");
              svgElem.setAttribute("height", "100%");
            }else{
              svgElem.setAttribute("width", boxWidth);
              svgElem.setAttribute("height", boxHeight);
            }

            svgElem.style.display = "block";
            var planetname = 'Kepler-' + Math.floor(Math.random()*782) + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 1);
            svgElem.id = planetname; // Ooo! Found another planet!

            // original height / calculated height of all trixels in a row top to bottom
            // var unitScale = unit || boxHeight / ( Triforce.trixelUnit * ( (Triforce.DNA.amountOfLayers - 1) * 2) );
            var unitScale = calcUnitScale(boxWidth, layersCount );

            _args.trixelsGeometry.all.forEach(function (obj,key) {
                  var path = document.createElement("path");
                  // debugger
                  // path.setAttributeNS (null, 'd', 'M ' + obj.v0.x + ' '+ obj.v0.y +'  L ' + obj.v1.x + ' '+ obj.v1.y +' L ' + obj.v2.x + ' '+ obj.v2.y +'z');
                  // path.setAttributeNS (null, 'd', 'M ' + obj.v0.x * unitScale + ' '+ obj.v0.y * unitScale +'  L ' + obj.v1.x * unitScale + ' '+ obj.v1.y * unitScale +' L ' + obj.v2.x * unitScale + ' '+ obj.v2.y * unitScale +'z');

                  // Theres an issue with Y being flipped, maybe to do with viewBox so * -1 seems to work fancy like!
                  path.setAttribute('d', 'M ' + obj.v0.x * unitScale + ' '+ (obj.v0.y * unitScale)*-1 +'  L ' + obj.v1.x * unitScale + ' '+ (obj.v1.y * unitScale)*-1 +' L ' + obj.v2.x * unitScale + ' '+ (obj.v2.y * unitScale)*-1 +'z');
                  

                  // var calcUnit = (600/ Triforce.trixelUnit )*2;
                  // path.setAttributeNS (null, 'd', 'M ' + obj.v0.x +calcUnit + ' '+ obj.v0.y +calcUnit +'  L ' + obj.v1.x +calcUnit + ' '+ obj.v1.y +calcUnit +' L ' + obj.v2.x +calcUnit + ' '+ obj.v2.y +calcUnit +'z');

                  // Pulling the color from the JSON file
                  if (typeof _args.JSONSource !== 'undefined'){
                      
                      
                          if (_args.JSONSource.trixels[key] && typeof _args.JSONSource.trixels[key].color !== 'undefined') {
                        // debugger
                              // obj.material.color.setStyle( _color_[key].color );
                              // obj.material.opacity = _color_[key].opacity;
                              // console.log(obj.color);

                              path.style.fill = _args.JSONSource.trixels[key].color;
                              path.style.fillOpacity = _args.JSONSource.trixels[key].opacity;
                          }
                   

                    
                  }else{
                      path.style.fill = randomRGB();
                      path.style.fillOpacity = 1;
                  }
                  svgElem.appendChild (path);
            });

            return {
              svgElement : svgElem,
              width : boxWidth,
              height : boxHeight
            };

      }

      function createPlaceHolderDIV (svgElem, width, height, scale) {
          
          // I'm sure this wont help here... probs unnecessary.
          var document = new Document();
          
          // not sure header matters here....
          var header = '<?xml version="1.0" encoding="utf-8"?>\n' +
                       '<!-- Generator: Kepler-Triforce 0.0.0, powered by Trixel.io. http://trixel.io -->\n' +
                       '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n\n'
          

          if (document.querySelector('#svgbox') !== null) {
                body.removeChild(document.querySelector('#svgbox'))
          };
          
          var canvas = document.createElement('div');
          canvas.id = 'svgbox';
          
          // canvas.width = 300;
          // canvas.height = 300;
          canvas.style.position = "fixed";
          canvas.style.top = "0px";
          canvas.style.left= "0px";
          canvas.style.zIndex = 100;
          canvas.style.border = 'solid 2px blue';
          
          // swap between fluid or not
          if (_args.scaleType) {
            canvas.style.width = "100%";
            canvas.style.height = "100%";
          }else{
            canvas.style.width = width+"px";
            canvas.style.height = height+"px";
          }
          
          window.body = document.querySelector('body');

          body.appendChild(canvas);

          canvas.appendChild(svgElem);  
      }
      

} // makey()
