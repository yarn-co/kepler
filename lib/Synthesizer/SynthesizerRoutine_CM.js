

var THREE = require('three/three.min.js');

var mathTools = require('../mathTools.js');

var Synthesizer = require('./Synthesizer.js');
var SynthesizerRoutine_CM = require('./SynthesizerRoutine_CM.js');

var visualTools = require('./visualTools.js');
var getMiniBarrierData = require('./getMiniBarrierData.js');




  
/*======================= ======================= ======================= 
  

  Synthesizer
  Synthesizer
  Synthesizer
  Synthesizer
  Synthesizer
  Synthesizer
  Synthesizer
  Synthesizer
  Synthesizer
    
      
======================= ======================= ======================= */ 


var SynthesizerRoutine_CM = module.exports = function(MAIN_DATA) {

  // MAIN_DATA
  /*
  var MAIN_DATA = {
    Geometry : null,
    trixelCount : null,
    layersCount : layersCount,
    originalTrixels : options.trixels,
    zoomIndex : layersCount, // the default is full screen, later things can adjust this
  }
  */

  var Synthesizer_Z = new Synthesizer();

  var TRIXELS_DATA = MAIN_DATA.Geometry.allTrixelsAsMeshes;

  Synthesizer_Z.buildDataTable(TRIXELS_DATA);

  Synthesizer_Z.TRIXELS_DATA[0];

  var scene = new THREE.Scene();


  mathTools.computeCentroidsFromMesh(Synthesizer_Z.TRIXELS_DATA);
  Synthesizer_Z.TRIXELS_DATA[0].centroid

  // Synthesizer_Z.TRIXELS_DATA[0].trixelMesh



  
  // console.log("Synthesizer_Z.TRIXELS_DATA.length", Synthesizer_Z.TRIXELS_DATA.length);
  var len = Synthesizer_Z.TRIXELS_DATA.length;
  // for (var i = 0; i < len; i++) {
  //   console.log("centroid", i, Synthesizer_Z.TRIXELS_DATA[i].centroid);
  // };



  console.log("<<<<<<<");
  console.log("<<<<<<<");
  console.log("<<<<<<<");
  console.log("<<<<<<<");
  console.log("<<<<<<<");
  console.log(" This will need to be updated with a +1 maybe");

  var more = 0;
  var zoomValue = 14 * (MAIN_DATA.zoomIndex + more)
  Synthesizer_Z.barrier = visualTools.buildHexCircle(zoomValue, 0xffeb52, false);
  // console.log(Synthesizer_Z.barrier.position);
  console.log("<<<<<<<");
  console.log("<<<<<<<");
  console.log("<<<<<<<");
  console.log("<<<<<<<");









  scene.add(Synthesizer_Z.barrier);
  // Synthesizer_Z.barrier.visible = false;


  var ORIGINAL_POINTS_MERGED_DATA = MAIN_DATA.Geometry.allPointsMerged;
  var pos_ = ORIGINAL_POINTS_MERGED_DATA[MAIN_DATA.gridIndex];

  // console.log("ORIGINAL_POINTS_MERGED_DATA", ORIGINAL_POINTS_MERGED_DATA.length);


  // try updating this does nothing while debugging
  Synthesizer_Z.barrier.position.copy(pos_);
  // console.log("before ", Synthesizer_Z.barrier.position);

  Synthesizer_Z.barrier.updateMatrix();
  // console.log("after ", Synthesizer_Z.barrier.position);

  var clonedBarrier = Synthesizer_Z.barrier.geometry.clone();
  clonedBarrier.applyMatrix(Synthesizer_Z.barrier.matrix);


  Synthesizer_Z.selectedTrixels = getMiniBarrierData.getAllGeometry(clonedBarrier, 
    Synthesizer_Z.TRIXELS_DATA)
  Synthesizer_Z.selectedTrixels.trixelsIn.length
  Synthesizer_Z.selectedTrixels.trixelsOut.length


  Synthesizer_Z.worldForSynth = new THREE.Group();
  scene.add(Synthesizer_Z.worldForSynth)

  // now rebuilding the main Geometry
  var newGeometry = Synthesizer_Z.rebuildMeshesAndColors(Synthesizer_Z.selectedTrixels);
  // At this point we now stop using Synthesizer_Z.TRIXELS_DATA
  // as we now have a new set of geometries
  // Synthesizer_Z.TRIXELS_DATA
  // Synthesizer_Z.trixelMeshesNewSet[0]



  // this draws a circle in gridIndex from the panData
  // This should match the center of the barrier if its offset

  // find the center point and the offset point
  // in earlier versions of Triforce/Trixel we did not have the key gridIndex
  var MAIN_CENTER_POINT = ORIGINAL_POINTS_MERGED_DATA[0];

  if (typeof MAIN_DATA.gridIndex !== 'undefined') {
    var MAIN_OFFSET_POINT = ORIGINAL_POINTS_MERGED_DATA[MAIN_DATA.gridIndex];
  }
  else {
    var MAIN_OFFSET_POINT = new THREE.Vector3(0,0,0);
  }

  var offsetCenterDisplay = Synthesizer_Z.computeOffsetFactor(MAIN_OFFSET_POINT, MAIN_CENTER_POINT )
  // console.log("options.gridIndex", MAIN_DATA.gridIndex);
  // console.log("options.zoomIndex", MAIN_DATA.zoomIndex);


  // console.log("MAIN_OFFSET_POINT", MAIN_OFFSET_POINT);
  // console.log("MAIN_CENTER_POINT", MAIN_CENTER_POINT);
  // console.log("offsetCenterDisplay", offsetCenterDisplay);


  // THIS is the Proof of the pudding, pudding has proof? Taste?
  // This will either show all of the glamor or not!!!!

  // this moves the Synthesizer_Z.trixelMeshesNewSet[0] of meshes
  var movedGeometry = Synthesizer_Z.realignGeometry();
  // var len = Synthesizer_Z.trixelMeshes.length;
  // for (var i = 0; i < len; i++) {
  //   var t = Synthesizer_Z.trixelMeshes[i];
  //   // t.position.sub(this.factorMutator);
  //   t.position.x = 2000;
  //   t.position.y = 2000;
  //   console.log("??????", t.position);

  //   // t.updateMatrix();
  // };

  return Synthesizer_Z;



}