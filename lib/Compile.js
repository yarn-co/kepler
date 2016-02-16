// Shim for html document
// var Document = require('html-document/lib/Document').Document;
// var KeplerHeader = require('./KeplerHTTPHeader');
var WorldBuilder = require('./WorldBuilder');

var KeplerHeader = require('./KeplerHTTPHeader');

var QuantumCardGenerator = require('./QuantumCardGenerator.js');

var mathTools = require('./mathTools.js');

var THREE = require('three/three.min.js');
var Synthesizer = require('./Synthesizer/Synthesizer.js');
var SynthesizerRoutine_CM = require('./Synthesizer/SynthesizerRoutine_CM.js');

var visualTools = require('./Synthesizer/visualTools.js');
var getMiniBarrierData = require('./Synthesizer/getMiniBarrierData.js');


// layerSplitter
// var layerSplitter = require('./LayerSplitter/layerSplitter.js');
// var buildSunAndSpiralGrids_CM = require('./LayerSplitter/buildSunAndSpiralGrids_CM.js');
var generateColorAndBleedLayersData_CM = require('./LayerSplitter/generateColorAndBleedLayersData_CM.js');
// var distanceTables = require('./LayerSplitter/distanceTables.js');


var BleedLayerRoutine_CM = require('./BleedLayer/BleedLayerRoutine_CM.js');
// var performBleedLayerColoring_CM = require('./BleedLayer/performBleedLayerColoring_CM.js');



// var trixelUtilites = require('./LayerSplitter/trixelUtilites.js');

// performBleedLayerColoring_CM = require('./BleedLayer/performBleedLayerColoring_CM.js');
// zigZawLayer = require('./BleedLayer/zigZawLayer.js');




var createSVG = require('./createSVG.js');



// var Tacos = require('./Synthesizer/Synthesizer.js');

var Synthesizer_Z = "fish"



var fs = require('fs');



// Options is a bad name here now, needs options and data
var Compile = module.exports = function (options) {

      var width = options.width;
      var jsonData = options.trixels;

      var BASE_UNIT = options.baseUnit;
      
      // TODO: THIS + 1 - 1 space odyssey has to stop
      
      /*======================= 
        
          >>> Bleedlayer, refactor this into new file
            
      =======================*/ 
      
      if(options.bleedLayer) {
        
        options.layers += 1; // +1 for iso-bleed! this should just be +1
        
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
      

      console.log("------------ BLEEDLAYER_More is set to 1");
      console.log("------------ BLEEDLAYER_More is set to 1");
      console.log("------------ BLEEDLAYER_More is set to 1");
      console.log("------------ BLEEDLAYER_More is set to 1");
      console.log("------------ BLEEDLAYER_More is set to 1");

      var BLEEDLAYER_More = 1;

      var layersCount = options.layers + BLEEDLAYER_More; // the default 
      var originalZoomIndex = options.zoomIndex + BLEEDLAYER_More; // the default 

      var MAIN_DATA = {
        Geometry : null,
        trixelCount : null,
        layersCount : layersCount,
        originalTrixels : options.trixels,
        zoomIndex : layersCount, // the default is full screen, later things can adjust this
        gridIndex : options.gridIndex
      }

      // FROM HERE ON OUT dont access options.trixels.length



      MAIN_DATA.Geometry = WorldBuilder.init( MAIN_DATA.layersCount, BASE_UNIT, MAIN_DATA.originalTrixels);
      MAIN_DATA.trixelCount =  MAIN_DATA.Geometry.allTrixelsAsMeshes.length;

/*======================= ======================= ======================= 
  
    Begin test adding module routines until it works

    Snyth would happen before the Bleed layer
    HOWEVER Bleed affects the inital layers count
    Sigh......
      
======================= ======================= ======================= */ 





/*======================= ======================= ======================= 
  
    Synth
      
======================= ======================= ======================= */ 

USE_Synthesizer_Z = false
USE_Synthesizer_Z = true

if (USE_Synthesizer_Z === true) {

  // for testing the SVG
  MAIN_DATA.zoomIndex = originalZoomIndex;

  // mutate the layers to match the zoom
  MAIN_DATA.layersCount = originalZoomIndex

  var Synthesizer_Z = SynthesizerRoutine_CM({

      Geometry : MAIN_DATA.Geometry,
      trixelCount : MAIN_DATA.trixelCount,
      layersCount : MAIN_DATA.layersCount,
      originalTrixels : MAIN_DATA.originalTrixels,
      zoomIndex : originalZoomIndex, // the default is full screen, later things can adjust this
      gridIndex : MAIN_DATA.gridIndex
  });


  MAIN_DATA.Geometry.allTrixelsAsMeshes = Synthesizer_Z.trixelMeshesNewSet;

};





/*======================= ======================= ======================= 
  
    Bleed layer
      
======================= ======================= ======================= */ 


// debugger
// Synthesizer_Z.trixelPlainVerctorsNewSet



USE_BleedLayerRoutine_Z = false
USE_BleedLayerRoutine_Z = true

if (USE_BleedLayerRoutine_Z === true) {

  // for testing the SVG
  // MAIN_DATA.zoomIndex = originalZoomIndex;

  var BleedLayerRoutine_Z = BleedLayerRoutine_CM({

      Geometry : MAIN_DATA.Geometry,
      trixelCount : MAIN_DATA.trixelCount,
      layersCount : MAIN_DATA.layersCount,
      originalTrixels : MAIN_DATA.originalTrixels,
      zoomIndex : MAIN_DATA.zoomIndex, // the default is full screen, later things can adjust this
      gridIndex : MAIN_DATA.gridIndex

  });


  MAIN_DATA.Geometry.allTrixelsAsMeshes = BleedLayerRoutine_Z.allTrixelsAsMeshes;

};









/*======================= 
  
    From here we would need to pass the Geometry Object
    The color data and trixel data to get would be 
    
    DONT repl then Geometry
    Its waaaaaaaaaaaay to slow to display
    
    Geometry.allTrixelsAsMeshes[4].material.color
    Geometry.allTrixelsAsMeshes[4].geometry.vertices
    
    var len = Geometry.allTrixelsAsMeshes.length;
    for (var i = 0; i < len; i++) {
      var t = Geometry.allTrixelsAsMeshes[i].geometry.vertices;
      var c = Geometry.allTrixelsAsMeshes[i].material.color;
      console.log("t",t,"c",c);
    };

    So this will need to then convert the color to an SVG readable color
    Geometry.allTrixelsAsMeshes[4].material.color.getStyle()
    or
    Geometry.allTrixelsAsMeshes[4].material.color.getHex()
    however hex gives hexadecimal not string text
    
    in the current but old color database that comes in the JSON object we have
    color: 'rgb(215,215,249)',
    This matches .getStyle() perfectly


=======================*/ 




/*======================= 
  
    The expected 
    Geometry.trixelMeshes
    simply needs the format of
    obj.geometry.vertices & obj.material.color | obj.material.opacity
    we dont need a full mesh object at this point

      
=======================*/ 





/*======================= 
  
    printer cutline
    We will need to screw around with this when we start to deal with
    highres mm of cut space
    the line itself can be larger then the trixel artspace
    the way they cut is not via a laser, its by hand to cut out the entire artspace
    of the cut line which is just sooo wrong, but this is how the printer is at the
    moment, other issues to solve like

=======================*/ 

// make this better
// we do this -1 to match the art layers count not the bleed count
var more = -1;
var zoomValue = 14 * (MAIN_DATA.zoomIndex + more)
// debugger
MAIN_DATA.Geometry.cutCircle = visualTools.buildHexCircle(zoomValue, 0xffeb52, false);
// a = visualTools.buildHexCircle(zoomValue, 0xffeb52, false);
// a.geometry.vertices


var SVG_Object = createSVG(MAIN_DATA.Geometry, options, MAIN_DATA.zoomIndex);

var card = new QuantumCardGenerator()
var cardData = card.createCard(SVG_Object, {});
SVG_Object.file = KeplerHeader + cardData;

console.log("----------------- card --------------------------");
console.log("");
console.log("");
console.log("");
console.log("");
console.log("cardData",cardData);
console.log("");
console.log("");
console.log("");
console.log("");
console.log("");




// var outputFilename = './test.txt';

// // fs.writeFile(outputFilename, cardData, function(err) {
// fs.writeFile(outputFilename, JSON.stringify(cardData, null, 4), function(err) {
//     if(err) {
//       console.log(err);
//     } else {
//       console.log("JSON saved to " + outputFilename);
//     }
// }); 







// debugger
// return cardData;
return SVG_Object;

// normal SVG file out
// return createSVG(MAIN_DATA.Geometry, options, MAIN_DATA.zoomIndex);


}; // makey()

