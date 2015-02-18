var SunflowerLogic = require('../core/SunflowerLogic');
var GridBuilderLoop = require('./Loop');

/* 
*     
*    Build trixels in each level from the sunflower logic operator
*       
*/
var BuildTrixelsInLevels = module.exports = function(World) {

  // var level = WORLD.amountOfLayers - 2;// if you play with the number it draws them in sync
  // we make a large number, no real reason for 54, todo: to be stored in a local database
  
  // sunflower cache: Here we try out if the cache is faster
  
  // var a = new Triforce.MetaEngine.SunflowerLogic.MakeLevelPointCountFromTriangleNumbers(54);
  // var cache = MakeLevelPoints_cache;
  var cache = new SunflowerLogic.MakeLevelPointCountFromTriangleNumbers(World.amountOfLayers + 2);
  // var b = TriangulateQuadrentEdges(level,a);
  // var c = BuildTrixelsIndexes(level,b)

  // account for the first level 0
  // for (var li = 2; li < level+2; li++) {
  /*  for (var li = 2; li < level+2 + FNUNITBUG; li++) {
        // _TrixelsDNA.levels++;
        console.log("Tacso");
        BIG_G.makemagictrixels(li,cache);
    };*/
  
  var level = World.amountOfLayers || 1;
  for (var key = 0; key < cache.length; key++) {
  
    if (key > 1) {
      
      GridBuilderLoop(World, key, cache);
    };


  }



}