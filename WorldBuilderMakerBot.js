
var SunflowerLogic = require('./SunflowerLogic');

/* 
*     
*    Build trixels in each level from the sunflower logic operator
*       
*/
Kepler.WorldBuilder.MakerBot = Kepler.WorldBuilder.BuildTrixelsInLevels = function(trixelViewer) {
  var BIG_G = Kepler.WorldBuilder;
  // var _TrixelsDNA = trixelViewer._TrixelsDNA;
  var WORLD = Kepler.WorldBuilder.world;

  // var level = WORLD.amountOfLayers - 2;// if you play with the number it draws them in sync
  // we make a large number, no real reason for 54, todo: to be stored in a local database
  
  // sunflower cache: Here we try out if the cache is faster
  
  // var a = new Triforce.MetaEngine.SunflowerLogic.MakeLevelPointCountFromTriangleNumbers(54);
  // var cache = MakeLevelPoints_cache;
  var cache = new SunflowerLogic.MakeLevelPointCountFromTriangleNumbers( WORLD.amountOfLayers + 2);
  // var b = TriangulateQuadrentEdges(level,a);
  // var c = BuildTrixelsIndexes(level,b)

  // account for the first level 0
  // for (var li = 2; li < level+2; li++) {
  /*  for (var li = 2; li < level+2 + FNUNITBUG; li++) {
        // _TrixelsDNA.levels++;
        console.log("Tacso");
        BIG_G.makemagictrixels(li,cache);
    };*/
  
  var temp = [];
  var level = WORLD.amountOfLayers || 1;
  for (var key = 0; key < cache.length; key++) {

  // var b = Kepler.SunflowerLogic.TriangulateQuadrentEdges( key , cache );

  if (key > 1) {
    
    BIG_G.GridBuilderLoop(key,cache);

      /*======================= 
        
          The rest of data below is just debug output
            
      =======================*/ 

    // var b = Kepler.SunflowerLogic.TriangulateQuadrentEdges( key , cache );


      
      
      // console.log("inner",b.innerEdge);
      // console.log("outer",b.outerEdge);

      // debugger
      // c = Kepler.SunflowerLogic.BuildTrixelsIndexes( key , b);



      // debugger
      // temp.push(c)
      // console.log(temp);
     /* for (var i = 0; i < 6; i++) {
          for (var u = 0; u < c.previous_level_trixels[i].length; u++) {
              // debugger
             
              var thismap = c.previous_level_trixels[i][u];

              var p0 = thismap[0];
              var p1 = thismap[1];
              var p2 = thismap[2];
              // console.log("previous_level_trixels", thismap);

          };
      };*/
      /*console.log("-------------");

      for (var i = 0; i < 6; i++) {
          for (var u = 0; u < c.previous_level_trixels[i].length; u++) {
             
              var thismap = c.current_level_trixels[i][u];

              var p0 = thismap[0];
              var p1 = thismap[1];
              var p2 = thismap[2];
              // console.log("current_level_trixels", thismap);

          };
      };
      console.log("==========");
    */
    };


  }



}//BuildTrixelsInLevels



/*


function temp_alksdsdfep (lev) {

  temp = [];
  level = lev || 1;
  cache = Kepler.SunflowerLogic.MakeLevelPointCountFromTriangleNumbers( level + 2 );
  // cache = MakeLevelPoints_cache;
    for (var key = 0; key < cache.length; key++) {
    
    // var b = Kepler.SunflowerLogic.TriangulateQuadrentEdges( key , cache );
    // debugger
      if (key > 1) {
        var b = Kepler.SunflowerLogic.TriangulateQuadrentEdges( key , cache );
    

      // console.log("inner",b.innerEdge);
      // console.log("outer",b.outerEdge);

      // debugger
      c = Kepler.SunflowerLogic.BuildTrixelsIndexes( key , b);
      // temp.push(c)
      // console.log(temp);
      for (var i = 0; i < 6; i++) {
          for (var u = 0; u < c.previous_level_trixels[i].length; u++) {
              // debugger
             
              var thismap = c.previous_level_trixels[i][u];

              var p0 = thismap[0];
              var p1 = thismap[1];
              var p2 = thismap[2];
              console.log("previous_level_trixels", thismap);

          };
      };
      console.log("-------------");

      for (var i = 0; i < 6; i++) {
          for (var u = 0; u < c.previous_level_trixels[i].length; u++) {
             
              var thismap = c.current_level_trixels[i][u];

              var p0 = thismap[0];
              var p1 = thismap[1];
              var p2 = thismap[2];
              console.log("current_level_trixels", thismap);

          };
      };
      console.log("==========");

    };
    // };


  }


}
*/