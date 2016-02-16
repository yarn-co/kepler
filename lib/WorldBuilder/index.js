
/*
*     
*  ================================================
*  Simple text only version of grid builder to be used with SVG outout
*  that skips the 3d world routines and geometry.
*  
*  v:2

  So history log. The previous version of this was based off of the older Triforce's
  mutated OCTREE solver for dealing with single based object creations.
  OCTREE was easy to show single based on creation, while the newer optimized GPU single based
  geometry was NOT. So we had two systems. This then became further complicated
  with Highres to allow 34+ layers. This newer solution was layers based but still proved
  tricky to view and debug live.
  A futher addition was then added to perform PAN and ZOOM locations via a new live hit 
  zone grids system. These points were formulated by the vertice points in the middle
  of each set of 6 trixels that visually have a hexagon.
  
  Another pain point of this setup was a tricky +1 layers thing you would run into
  While logical, it also lead to confusion by all parties. Too remove? Or just get the 
  app done for now.


  The hitzones are the key to this refactor. One or the other refactor will go in, the new logic
  for layers building or a tweak for the vertices generators. Not know as of this point. Will post
  in the next line which is picked.



*  
*  
*  
*  
*  
*  
*  
*  
*  

need to rename
Triforce.MetaEngine.BuildSubdividePoints
var cache = Triforce.MetaEngine.SunflowerLogic.MakeLevelPoints_cache;
var newGeometry = new Triforce.MetaEngine.BuildSubdividePoints.init({

*  

buildGrid = new Kepler.WorldBuilder.init(10,14);
BUG: to do with levels wonkynesssssss level has to be higher then 3 or it returns arrays of undefined
in the all property
*/

var BuildTrixelsInLevels = require('./MakerBot');
var BuildSubdividePoints = require('../core/BuildSubdividePoints');

// This needs to be moved
// and does it belong here anyway?
var visualTools = require('../Synthesizer/visualTools.js');

var THREE = require('three/three.min.js');

var internals = {};

var WorldBuilder = module.exports = {};

var fs = require('fs');

// Example of the output                    
// rename allStoredTrixelPoints to vertices, < well need this for Hitzones refactor in
/*

{
  all:[],
  layers:[],
  allStoredTrixelPoints:[0],
  amountOfLayers:0,
  trixelUnit : 0,
  currentBaseLevel: 2
  storedLayers:[], < should be length of visual rings and no greater
};

*/

/*======================= 
  
    @amountOfLayers: has a +1 issue right now otherwise our requested count say 34
    @trixelUnit might as well remove it, defaults as should remain at 14
      UNLESS we need it for a scaling trick someday soooooo leave it in.
      
=======================*/ 


/*======================= 
  

  Geometry = WorldBuilder.init(1);
      Geometry.storedLayers
      Geometry.storedLayers[i].geometry
      vertices display

  Geometry = WorldBuilder.init(1);
  b = visualTools.displayLayer(Geometry.storedLayers[1].geometry)
  scene.add(b)

  b = visualTools.displayLayer(Geometry.storedLayers[0].geometry)
  scene.add(b)
  
  
  display our rings total

  Geometry = WorldBuilder.init(1);
  var len = Geometry.storedLayers.length;
  for (var i = 0; i < len; i++) {
    var b = visualTools.displayLayer(Geometry.storedLayers[i].geometry)
    scene.add(b)
  };

  

  so 1 here is the basis of what?
  I request 1 layer
  OR I request 1 ring?

  The first function is simply
  BuildMultipleLayersOfHexCircles
  Aka ring

  the arg is amountOfLayers
  aka a layer

  fakeDebug(4)
=======================*/ 
function fakeDebug(requestedLayersCount) {



  // requestedLayersCount = 2

  ringsGroup = new THREE.Group()
  scene.add(ringsGroup)
  ringsGroup.position.z = 24


  Geometry = WorldBuilder.init( requestedLayersCount );

  // debug display the rings
  var len = Geometry.storedLayers.length;
  for (var i = 0; i < len; i++) {
    var b = visualTools.displayLayer(Geometry.storedLayers[i].geometry)
    ringsGroup.add(b);
  };




  // display all trixels
  var len = Geometry.allTrixelsAsMeshes.length;
  for (var i = 0; i < len; i++) {
    scene.add( Geometry.allTrixelsAsMeshes[i] );
  };





}




WorldBuilder.init = function (requestedLayersCount, trixelUnit, originalTrixels) {

  // THIS is our new -1 location
  // as in we request 0 rings if one layer
  requestedLayersCount -= 1

  // This will get passed through the functions and return
  var World = {

    // ALL TRIXEL geometries, NOT just the points
    // so objects of array xyz length 3's
    allTrixels:[],
    allTrixelsAsMeshes: [],
    
    // Ok so this was fixed, BUT its not meshes!!!
    // Its just objects of vectors
    layers:[],
    // need this next
    layersAsMeshes: [],

    // these two are points arrays, NOT trixels
    // rename to storedLayersOfPoints Cause its POINTS not trixels here
    storedLayers:[], // raw layers data
    storedLayersClean:[], // cleaned up data for use with Hitzones
    allPointsMerged: [], // the actual hitpoints array


    allStoredTrixelPoints:[0],
    amountOfLayers: requestedLayersCount,
    trixelUnit : trixelUnit || 14,
    currentBaseLevel: 2
  };


  // make sure order stays
  // make sure order stays
  // make sure order stays


  // changing order
  // Let's say, if amountOfLayers === 1
  // then just create the first 6 and exit
  // otherwise carry on and do a +1 to the amountOfRings arrg



  // stage 1
  // while this returns the vertices its main job is to build up the rings
  // they would need to be "seen" to be tested
  WorldBuilder.BuildMultipleLayersOfHexCircles(World, requestedLayersCount);
  

  // stage 2
  // special for the first 6 trixels
  // it builds the first layer
  // superceeded via the HighRes rewrite later on
  WorldBuilder.firstHexCircle(World);


  // Stage 3 
  // this builds the trixels via each level/layer
  // We could then store this last layer out as data for the bleed layer
  // system to avoid complex guessing as was previous
  BuildTrixelsInLevels(World);
  



  // Stage 4
  // This modifies the layers to remove the closing point
  World.storedLayersClean = WorldBuilder.cleanUpLayersPointsData(World.storedLayers);

  // Stage 5
  // This then merges all of the layers to a points array
  // so we can have hitzones for Synthesizing the geometry from the
  // Pan and zoom locations later on
  World.allPointsMerged = WorldBuilder.mergeLayersToPoints(World.storedLayersClean);


  // stage 6
  // This could be super replaced during the Synthesizer step
  // but for now it creates the layers in inner and outer trixels as meshes
  WorldBuilder.createTrixelMeshesInLayers_CM(World);



  // stage 7
  // copy back the colors into the mew meshes
  if (originalTrixels) {
    WorldBuilder.matchColors(World, originalTrixels);
  };

  // this test shows
  // 1332.972ms
  // 8.244ms
  // so it does prove that unnecessary Mesh creation is slower
  // how much this performs though is very small
  // so a task for another day

/*
console.log("-------- Fish ---------");
console.time()
  var T = [];
  var len = 14000;
  for (var i = 0; i < len; i++) {
    var t = visualTools.createTrixel([
          { x: 90, y: 80, z: 0 },
          { x: 10, y: 10, z: 0 },
          { x: 0, y: 0, z: 0 }] )
    T.push(t);
  };
console.timeEnd()

console.log("-------- marf ---------");
console.time() 
  var G = [];
  var len = 14000;
  for (var i = 0; i < len; i++) {
    var t = [
          { x: 90, y: 80, z: 0 },
          { x: 10, y: 10, z: 0 },
          { x: 0, y: 0, z: 0 }
          ]
    G.push(t);
  };
console.timeEnd()
*/

  return World;
}



/* 
*     
*    Make a central circle from point count namely 6 needed
*    to make the Higgs Boson hexCircle
*       
*/

WorldBuilder.BuildHexCircle = function(World, args){
    
  // a stayover dealing with BuildSubdividePoints
  var trixelViewer = {
    _TrixelsDNA : {
      logComputedPoints : false
    }
  }

  var radius = args.radius || 14;
  var segmentCount = args.segmentCount || 6;
  var color = args.color || 0x520061;
  var currentedgeindex = args.currentedgeindex;

  var geometry = { vertices : [] };


  // goes counter clockwise from -theta since the grid finder is also
  // based on this direction
  for (var i = 0; i <= segmentCount; i++) {
        var theta = (i / segmentCount) * Math.PI * 2;
        geometry.vertices.push(
            {
              x: Math.sin(-theta) * radius,
              y: Math.cos(-theta) * radius,
              z: 0
            }
        );
  }

  var newGeometry = new BuildSubdividePoints.init({
      currentlevel : World.currentBaseLevel,
      currentedgeindex : 0,
      currentVerts : geometry.vertices,
      parentObject : null,
      Global : trixelViewer
  });
  // console.log(newGeometry.length);

  // reapply new vertices to the geometry
  geometry.vertices = [];
  geometry.vertices = newGeometry;

  var line = { geometry : geometry }

  return line;
}


/* 
*     
*    Build a bunch of rings and store their points in array totalTrixels
*    two Rings are considered a Layer starting at layer 2 and onward
*       
*/
WorldBuilder.BuildMultipleLayersOfHexCircles = function(World, amountOfLayers){
  
  var vertsCurrentIndex = 0;
  var moreee = 0;
  /* 

      Begin building the rings for the amount of layers given
      we don't need the first two so start i at 2

      starting with the rewrite we are caching the calculation of the points that are created
      but not drawing geometries slow: maybe. Have to test
      We need these to be available to create new layers at any point later
      54 is an arbitrary limit here.
  

      OH HO.. Soooo 54 was not so arbitrary
      http://en.wikipedia.org/wiki/Fibonacci_number
      It is often said that sunflowers and similar arrangements have 55 spirals in one direction
      and 89 in the other (or some other pair of adjacent Fibonacci numbers), but this is true only
      of one range of radii, typically the outermost and thus most conspicuous.[60]

  */

  // so if request 1 we get a 3 here
  // var layersCount = World.amountOfLayers + 2 || 54;
  var layersCount = amountOfLayers + 2 || 54;
  // which means the below limit pattern is
  // i = 1,2
  // cause 14* 0 is 0 instead of 14
  // or request ring radius 14, 28

  for (var i = 1; i < layersCount; i++) {
      var layers = WorldBuilder.BuildHexCircle(World, {
        radius : World.trixelUnit*(i)
      });
      World.storedLayers.push(layers);
      // console.log("layers.geometry.vertices.length",layers.geometry.vertices.length -1);
      // console.log(layers.geometry.vertices[0]);
      // console.log(layers.geometry.vertices[1]);
      // console.log(layers.geometry.vertices[2]);
      // console.log("-------");
      
      // needed for each hexCircle ring thats drawn in the subdivide routine
      World.currentBaseLevel++;


      // store the original vertices
      var verts = layers.geometry.vertices;

      // storing the vertices from the layer now
      for (var o = 0; o < verts.length; o++) {

          World.allStoredTrixelPoints[vertsCurrentIndex] = verts[o];

          vertsCurrentIndex++;
      };
        

  };

  return verts;
}

/* 
*     
*    build up all trixels from the new stored points and subdivides
*    This needs some pruning
*/
// special for the first 6 trixels
WorldBuilder.firstHexCircle = function(World) {

  var layer = [];
  for (var i = 0; i < 6; i++) {
    
      var thismap0 = World.allStoredTrixelPoints[i];
      var thismap1 = World.allStoredTrixelPoints[i+1];

      // Need to find what calls this opject patteren and swap to a simple array
      // [0,1,2]
      // Its from createTrixel
      // var singleTrixel = {
      //   v0 : { x: thismap0.x, y: thismap0.y, z: 0 },
      //   v1 : { x: thismap1.x, y: thismap1.y, z: 0 },
      //   v2 : { x: 0, y: 0, z: 0 },
      // };
      var singleTrixel = [
        { x: thismap0.x, y: thismap0.y, z: 0 },
        { x: thismap1.x, y: thismap1.y, z: 0 },
        { x: 0, y: 0, z: 0 },
      ];

      // FK it, just add them to a world object for now
      World.allTrixels.push(singleTrixel);

      layer.push(singleTrixel);

  };

  // push first layer to list
  World.layers.push(layer);
  
}





/*======================= 
    
    WAIIIIIIIIT not sure this is correct 

    cleaning up set of vertices in layers so we get a clean set of hitZones
    to perform our masking routine later on for dynamic trixel getting

    In this our original data
    A: did not have a 0 point center
    B: the layers have a logical closing point that mirrors the first in the layer ring
      so we dont need that, so we can have clean data and a clean count of points to test
      building from

    var L_ = WorldBuilder.cleanUpLayersPointsData(World.storedLayers);
      
=======================*/
WorldBuilder.cleanUpLayersPointsData = function(layersArray) {

  // before cleaned
  // [0].length -> 7, [1].length -> 13
  var clonedData = WorldBuilder.cheapLayersClone(layersArray);

  // clean up the data by removing the closing point
  // [0].length -> 6, [1].length -> 12
  var len = clonedData.length;
  for (var i = 0; i < len; i++) {
    clonedData[i].pop()
  };

  // and then add a zero point
  clonedData.unshift([{x:0,y:0,z:0}]);

  return clonedData;

}


/*======================= 
  
    pass a geometry layer of points and return just layers in points
    so we make sure not to change the geometry vertice count without purpose
      
    World.storedLayers[0].geometry.vertices
    WorldBuilder.cheapLayersClone(World.storedLayers)

=======================*/ 

WorldBuilder.cheapLayersClone = function(layersArray) {

  var newList = [];
  var len = layersArray.length;

  // get the layer
  for (var i = 0; i < len; i++) {

    // getting the vertice
    var newLayer = [];
    var len2 = layersArray[i].geometry.vertices.length;
    for (var g = 0; g < len2; g++) {
      
      var X = {
        x: layersArray[i].geometry.vertices[g].x,
        y: layersArray[i].geometry.vertices[g].y,
        z: layersArray[i].geometry.vertices[g].z
      };
      newLayer.push(X);
    };
  
    newList.push(newLayer);
  
  };

  return newList;
}

/*======================= 
  
   This generates the points that will be used for the Hitzones Pan zoom data
   it merges down the points layers after they have been cleaned 
  
=======================*/ 
WorldBuilder.mergeLayersToPoints = function(cleanedLayersArray) {
  var newPoints = []
  var len = cleanedLayersArray.length;
  for (var i = 0; i < len; i++) {
    

    var len2 = cleanedLayersArray[i].length;
    for (var g = 0; g < len2; g++) {
      newPoints.push(cleanedLayersArray[i][g])
    };
  };
  return newPoints;
}





/*======================= 
  
  now create and sort the trixels as meshes into layers
      
=======================*/ 
WorldBuilder.createTrixelMeshesInLayers_CM = function(World) {
  
  // first layer
  var firstLayer = World.layers[0];
  World.layersAsMeshes[0] = [];

  var len = firstLayer.length;
  for (var i = 0; i < len; i++) {
    var t = visualTools.createTrixel( firstLayer[i] )
    World.layersAsMeshes[0].push(t);
    World.allTrixelsAsMeshes.push(t);
    // scene.add(t)
  };


  // all other layers
  var len = World.layers.length;

  for (var i = 1; i < len; i++) {

    var layerGroup = [[],[]];
    
    var workingLayer = World.layers[i];

    // inner
    var len2 = workingLayer[0].length;
    for (var h = 0; h < len2; h++) {

      // test if object instanceof THREE.Object3D
      // a node issue with THREE?
      // t instanceof THREE.Object3D

      var t = visualTools.createTrixel( workingLayer[0][h] )
      layerGroup[[0]].push(t);

      World.allTrixelsAsMeshes.push(t);
    };
    
    // outer
    var len3 = workingLayer[1].length;
    for (var g = 0; g < len3; g++) {
      var t = visualTools.createTrixel( workingLayer[1][g] )
      layerGroup[[1]].push(t);
      World.allTrixelsAsMeshes.push(t);
    };

    World.layersAsMeshes.push(layerGroup);
  };


}




/*======================= 
    
    pass the original trixels JSON that retain the colors
    to match the painting

    The idea really is that we need to rematch the colors

    We could just simply
    For geometry match the centroids locs and copy the color
    But this is a power of two so
    700*700 = 490,000 lookups
    Ehhhhhh...............

    So we're not gonna do that.
    
=======================*/ 

WorldBuilder.matchColors = function(World, originalTrixels) {

  var len = originalTrixels.length;
  for (var i = 0; i < len; i++) {
    var c = originalTrixels[i].color;
    var o = originalTrixels[i].opacity;

    var rgb = c.replace(/[^\d,]/g, '').split(',');
    rgb = [ +rgb[0]/255,+rgb[1]/255, +rgb[2]/255 ];
    World.allTrixelsAsMeshes[i].material.color.setRGB( rgb[0], rgb[1], rgb[2] )
    World.allTrixelsAsMeshes[i].material.opacity = o;

  };

}

