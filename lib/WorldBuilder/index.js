
/*
*     
*  ================================================
*  Simple text only version of grid builder to be used with SVG outout
*  that skips the 3d world routines and geometry.
*  
*  v:0
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

var internals = {};

var WorldBuilder = module.exports = {};

// Database                        
// rename allStoredTrixelPoints to vertices
// Kepler.WorldBuilder.world = {
//   all:[],
//   layers:[],
//   allStoredTrixelPoints:[0],
//   amountOfLayers:0,
//   trixelUnit : 0,
//   currentBaseLevel: 2

// };


WorldBuilder.seek = WorldBuilder.init = function (amountOfLayers, trixelUnit) {

  // build and reset
  var World = {
    all:[],
    layers:[],
    allStoredTrixelPoints:[0],
    amountOfLayers:0,
    trixelUnit : 0,
    currentBaseLevel: 2
  };
  
  World.amountOfLayers = amountOfLayers;
  World.trixelUnit = trixelUnit;

  // make sure order stays
  internals.BuildMultipleLayersOfHexCircles(World);
  
  // special for the first 6 trixels
  internals.firstHexCircle(World);
  
  BuildTrixelsInLevels(World);

  return World;
}



/* 
*     
*    Make a central circle from point count namely 6 needed
*    to make the Higgs Boson hexCircle
*       
*/

internals.BuildHexCircle = function(World, args){
    
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

  // var geometry = new THREE.Geometry(),
  var geometry = { vertices : [] };


  // goes counter clockwise from -theta since the grid finder is also
  // based on this direction
  for (var i = 0; i <= segmentCount; i++) {
        var theta = (i / segmentCount) * Math.PI * 2;
        geometry.vertices.push(
            // new BIG_G.Vector3(
            //     Math.sin(-theta) * this.radius,
            //     Math.cos(-theta) * this.radius,
            //     0));
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
  // debugger

  // reapply new vertices to the geometry
  geometry.vertices = [];
  geometry.vertices = newGeometry;
// debugger
  var line = { geometry : geometry }
  // return new THREE.Line(geometry, material);
  return line;
}


/* 
*     
*    Build a bunch of rings and store their points in array totalTrixels
*    Rings are considered Levels 
*       
*/
internals.BuildMultipleLayersOfHexCircles = function(World){
  
  var vertsCurrentIndex = 0;
  var moreee = 0;

  // Begin building the rings for the amount of layers given
  // we don't need the first two so start i at 2

  // starting with the rewrite we are caching the calculation of the points that are created
  // but not drawing geometries slow: maybe. Have to test
  // We need these to be available to create new layers at any point later
  // 54 is an arbitrary limit here.
  

  /* 
  *     
  *    OH HO.. Soooo 54 was not so arbitrary
      http://en.wikipedia.org/wiki/Fibonacci_number
  *    It is often said that sunflowers and similar arrangements have 55 spirals in one direction
        and 89 in the other (or some other pair of adjacent Fibonacci numbers), but this is true only
         of one range of radii, typically the outermost and thus most conspicuous.[60]
  *       
  */
  //console.warn("arbitrary limit 54");
  // var layersCount = WORLD.amountOfLayers + 1 || 54;
  
  // TODO: is this fine below?
  var layersCount = World.amountOfLayers + 2 || 54;
  
  // var layersCount = 54;
  // var layersCount = 14;

  for (var i = 1; i < layersCount; i++) {
  // for (var i = 0; i < layersCount; i++) {
    // debugger
  // for (var i = 1; i < trixelViewer._TrixelsDNA.amountOfLayers; i++) {
    // console.log("Popcorn");
      var layers = internals.BuildHexCircle(World, {
        radius : World.trixelUnit*(i)
      });
      //console.log("Popcorn");
      // console.log("layers.geometry.vertices.length",layers.geometry.vertices.length -1);
      // debugger
      // <<<<
      // console.log(layers.geometry.vertices[0]);
      // console.log(layers.geometry.vertices[1]);
      // console.log(layers.geometry.vertices[2]);
      // console.log("-------");
      // debugger
      
      // needed for each hexCircle ring thats drawn in the subdivide routine
      World.currentBaseLevel++;


      // store the original vertices
      var verts = layers.geometry.vertices;
      // debugger
      // console.log("vertsCurrentIndex", vertsCurrentIndex);

      // storing the vertices from the layer now
      for (var o = 0; o < verts.length; o++) {

          // TODO: this indexing seems wrong.  doesn't vertsCurrentIndex reset to 0 each time?  maybe I'm misunderstanding!
          World.allStoredTrixelPoints[vertsCurrentIndex] = verts[o];

          vertsCurrentIndex++;
      };
        

  };
  // console.log(verts);
  return verts;
}

/* 
*     
*    build up all trixels from the new stored points and subdivides
*       
*/
// special for the first 6 trixels
internals.firstHexCircle = function(World) {

  var _layer = [];
  for (var i = 0; i < 6; i++) {
    
      var thismap0 = World.allStoredTrixelPoints[i];
      var thismap1 = World.allStoredTrixelPoints[i+1];

      var singleTrixel = {
        v0 : { x: thismap0.x, y: thismap0.y, z: 0 },
        v1 : { x: thismap1.x, y: thismap1.y, z: 0 },
        v2 : { x: 0, y: 0, z: 0 },
      };

   

      // FK it, just add them to a world object for now
      World.all.push(singleTrixel);

      _layer.push(singleTrixel);

  };

  // push first layer to list
  World.layers.push(_layer);
  
}


