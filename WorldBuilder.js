
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


Kepler.WorldBuilder = {};

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


Kepler.WorldBuilder.seek = Kepler.WorldBuilder.init = function (amountOfLayers, trixelUnit) {

  // build and reset
  Kepler.WorldBuilder.world = {
    all:[],
    layers:[],
    allStoredTrixelPoints:[0],
    amountOfLayers:0,
    trixelUnit : 0,
    currentBaseLevel: 2

  };

  var BIG_G = Kepler.WorldBuilder;
  
  Kepler.WorldBuilder.world.amountOfLayers = amountOfLayers;
  Kepler.WorldBuilder.world.trixelUnit = trixelUnit;

  // make sure order stays
  BIG_G.BuildMultipleLayersOfHexCircles();
  // special for the first 6 trixels
  BIG_G.firstHexCircle();
  // if (_TrixelsDNA.BuildTrixels === true) {
  BIG_G.BuildTrixelsInLevels();
  // };
  // BIG_G.ParseDown();

  return BIG_G.world;
}

// simplified Vector for this text output without needing ThreeJS
// Kepler.WorldBuilder.Vector3 = function (x,y,z) {
//   this.x = x || 0;
//   this.y = y || 0;
//   this.z = z || 0;
//   return {x:this.x,y:this.y,z:this.z};
// }

/* 
*     
*    We need to only return the ammout of layers trixels that match our level count
*    Depreciated, was used when layers request was 54
*       
*/
Kepler.WorldBuilder.ParseDown = function  () {
  var n = 6;
  for (var i = 0; i < Kepler.WorldBuilder.world.amountOfLayers; i++) {
    n += 12;
  };
  var temp = [];
  for (var i = 0; i < n; i++) {
    temp.push( Kepler.WorldBuilder.world.all[i] );
  };
  // Kepler.WorldBuilder.world.all.length
  temp.slice(0);
  Kepler.WorldBuilder.world.all.length = 0;
  Kepler.WorldBuilder.world.all = temp;

  
}


/* 
*     
*    Make a central circle from point count namely 6 needed
*    to make the Higgs Boson hexCircle
*       
*/

Kepler.WorldBuilder.BuildHexCircle = function(args){
  
  var BIG_G = Kepler.WorldBuilder;
  var WORLD = Kepler.WorldBuilder.world;
  // a stayover dealing with BuildSubdividePoints
  var trixelViewer = {
    _TrixelsDNA : {
      logComputedPoints : false
    }
  }

  this.radius = args.radius || 14;
  this.segmentCount = args.segmentCount || 6;
  this.color = args.color || 0x520061;
  var currentedgeindex = args.currentedgeindex;

  // var geometry = new THREE.Geometry(),
  var geometry = { vertices : [] };


  // goes counter clockwise from -theta since the grid finder is also
  // based on this direction
  for (var i = 0; i <= this.segmentCount; i++) {
        var theta = (i / this.segmentCount) * Math.PI * 2;
        geometry.vertices.push(
            // new BIG_G.Vector3(
            //     Math.sin(-theta) * this.radius,
            //     Math.cos(-theta) * this.radius,
            //     0));
            {
              x: Math.sin(-theta) * this.radius,
              y: Math.cos(-theta) * this.radius,
              z: 0
            }
        );
  }

  var newGeometry = new Kepler.BuildSubdividePoints.init({
      currentlevel : WORLD.currentBaseLevel,
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
Kepler.WorldBuilder.BuildMultipleLayersOfHexCircles = function(){
  var BIG_G = Kepler.WorldBuilder;
  var WORLD = Kepler.WorldBuilder.world;

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
  console.warn("arbitrary limit 54");
  // var layersCount = WORLD.amountOfLayers + 1 || 54;
  var layersCount = WORLD.amountOfLayers + 2 || 54;
  // var layersCount = 54;
  // var layersCount = 14;

  for (var i = 1; i < layersCount; i++) {
  // for (var i = 0; i < layersCount; i++) {
    // debugger
  // for (var i = 1; i < trixelViewer._TrixelsDNA.amountOfLayers; i++) {
    // console.log("Popcorn");
      var layers = new BIG_G.BuildHexCircle({
        radius : WORLD.trixelUnit*(i)
      });
      console.log("Popcorn");
      // console.log("layers.geometry.vertices.length",layers.geometry.vertices.length -1);
      // debugger
      // <<<<
      // console.log(layers.geometry.vertices[0]);
      // console.log(layers.geometry.vertices[1]);
      // console.log(layers.geometry.vertices[2]);
      // console.log("-------");
      // debugger
      
      // needed for each hexCircle ring thats drawn in the subdivide routine
      WORLD.currentBaseLevel++;


      // store the original vertices
      var verts = layers.geometry.vertices;
      // debugger
      // console.log("vertsCurrentIndex", vertsCurrentIndex);

      // storing the vertices from the layer now
      for (var o = 0; o < verts.length; o++) {

          WORLD.allStoredTrixelPoints[vertsCurrentIndex] = verts[o];

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
Kepler.WorldBuilder.firstHexCircle = function() {
  var BIG_G = Kepler.WorldBuilder;
  var WORLD = Kepler.WorldBuilder.world;

  // var mixcolor = Triforce.Tools.makeRandomHexColor();
  var templayers = [];
  // var _TrixelsDNA = trixelViewer._TrixelsDNA;

  var _layer = [];
  for (var i = 0; i < 6; i++) {
    
      var thismap0 = WORLD.allStoredTrixelPoints[i];
      var thismap1 = WORLD.allStoredTrixelPoints[i+1];

      var singleTrixel = {
        v0 : { x: thismap0.x, y: thismap0.y, z: 0 },
        v1 : { x: thismap1.x, y: thismap1.y, z: 0 },
        v2 : { x: 0, y: 0, z: 0 },
      };

   

      // FK it, just add them to a world object for now
      Kepler.WorldBuilder.world.all.push(singleTrixel);

      _layer.push(singleTrixel);

  };

  // push first layer to list
  Kepler.WorldBuilder.world.layers.push(_layer);
  
  
}


