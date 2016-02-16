
/*======================= 
  
    first entry composition to the Bleed Layer
      
=======================*/ 


var mathTools = require('../mathTools.js');

var THREE = require('three/three.min.js');

var DataModel = require('../DataModel.js');

var BleedLayer = require('./BleedLayer.js');

// layerSplitter
var generateColorAndBleedLayersData_CM = require('../LayerSplitter/generateColorAndBleedLayersData_CM.js');

var performBleedLayerColoring_CM = require('./performBleedLayerColoring_CM.js');


var BleedLayerRoutine_CM = module.exports = function(MAIN_DATA) {
  
  /*
  reference to the arguments in
  var MAIN_DATA = {
    Geometry : null,
    trixelCount : null,
    layersCount : layersCount,
    originalTrixels : options.trixels,
    zoomIndex : layersCount, // the default is full screen, later things can adjust this
  }
  */
  // MAIN_DATA.Geometry.allTrixelsAsMeshes.length


  var BleedLayer_Z = new BleedLayer();

  var TRIXELS_DATA = MAIN_DATA.Geometry.allTrixelsAsMeshes;

  BleedLayer_Z.buildDataTable(TRIXELS_DATA);
  // BleedLayer_Z.TRIXELS_DATA[0]



  mathTools.computeCentroidsFromMesh(BleedLayer_Z.TRIXELS_DATA);
  // BleedLayer_Z.TRIXELS_DATA[0].trixelMesh
  // debugger


  console.warn("------------------ <<< ");
  console.warn("------------------ <<< ");
  console.warn("------------------ <<< ");
  console.warn("------------------ <<< ");
  console.warn("------------------ <<< ");
  console.warn(" we should not need this options.zoomIndex-1 MAYBE ");

  
  // <<<
  var MAIN_Quads = generateColorAndBleedLayersData_CM(MAIN_DATA.zoomIndex-1, BleedLayer_Z);
  // var MAIN_Quads = generateColorAndBleedLayersData_CM(MAIN_DATA.zoomIndex, BleedLayer_Z)

  // MAIN_Quads.originalLayer[0]
  // MAIN_Quads.bleedLayer[0]

  /*======================= 
    
      this Mutates the colors of the geometry
      so we can then read of the meshes again
      BleedLayer_Z.TRIXELS_DATA[0].trixelMesh.material.color
        
  =======================*/ 

  performBleedLayerColoring_CM(MAIN_Quads.bleedLayer, MAIN_Quads.originalLayer)


  // and thus we can then do this remapping again
  // BleedLayer_Z.TRIXELS_DATA.length
  // Geometry.allTrixelsAsMeshes.length
  // Geometry.allTrixelsAsMeshes = BleedLayer_Z.trixelMeshesNewSet;

  var len = BleedLayer_Z.TRIXELS_DATA.length;
  for (var i = 0; i < len; i++) {
    MAIN_DATA.Geometry.allTrixelsAsMeshes[i] = BleedLayer_Z.TRIXELS_DATA[i].trixelMesh;
  };


  return MAIN_DATA.Geometry;

}
