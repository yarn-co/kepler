
var SunflowerLogic = require('../core/SunflowerLogic');

/*======================= 
    This builds the trixel arrays 
    [ { [{},{},{}] }, {} ]
      
=======================*/ 

var GridBuilderLoop = module.exports = function(World, level, cache) {
// var GridBuilderLoop = function(World, level, cache) {
        
      
      // add a new layer
      var MainNewLayer = [[],[]]; 
      


      // var b = Triforce.MetaEngine.SunflowerLogic.TriangulateQuadrentEdges(level,cache);
      var b = SunflowerLogic.TriangulateQuadrentEdges(level, cache);
      
      // var c = Triforce.MetaEngine.SunflowerLogic.BuildTrixelsIndexes(level,b);
      var c = SunflowerLogic.BuildTrixelsIndexes(level, b);

      /*======================= 
        
          previous layer loop
            
      =======================*/ 
      

      
      // length 6 is known, its the edges of the hexagon
      var temp_layer_inner = [];
      for (var i = 0; i < 6; i++) {
      
          // This draws as many trixels were in the previous layer array
          for (var u = 0; u < c.previous_level_trixels[i].length; u++) {
              
              var mixcolor = Math.random() * 0xffffff;
      
              var thismap = c.previous_level_trixels[i][u];

              var p0 = thismap[0];
              var p1 = thismap[1];
              var p2 = thismap[2];

              // once stable remove this try block to optimize
              // try {
                  
                  // var singleTrixel = {
          
                  //   v0 : { x: World.allStoredTrixelPoints[p0].x, y: World.allStoredTrixelPoints[p0].y, z: 0 },
          
                  //   v1 : { x: World.allStoredTrixelPoints[p1].x, y: World.allStoredTrixelPoints[p1].y, z: 0 },
          
                  //   v2 : { x: World.allStoredTrixelPoints[p2].x, y: World.allStoredTrixelPoints[p2].y, z: 0 },
          
                  // };
                  var singleTrixel = [
                  
                    { x: World.allStoredTrixelPoints[p0].x, y: World.allStoredTrixelPoints[p0].y, z: 0 },
                  
                    { x: World.allStoredTrixelPoints[p1].x, y: World.allStoredTrixelPoints[p1].y, z: 0 },
                  
                    { x: World.allStoredTrixelPoints[p2].x, y: World.allStoredTrixelPoints[p2].y, z: 0 },
                  
                  ];
              // }
              // catch(err) {
              //   debugger
              // } 
              
              temp_layer_inner.push(singleTrixel);

              // Add trixel to a world object
              World.allTrixels.push(singleTrixel);
          };

      };

      // Adding the inner layer
      MainNewLayer[0] = temp_layer_inner;
      
      /*======================= 
        
          current layer loop
            
      =======================*/ 
      
      
      var temp_layer_outer = [];
      
      for (var i = 0; i < 6; i++) {
      
          var mixcolor = Math.random() * 0xffffff;

          for (var u = 0; u < c.current_level_trixels[i].length; u++) {
      
              var thismap = c.current_level_trixels[i][u];

              var p0 = thismap[0];
              var p1 = thismap[1];
              var p2 = thismap[2];

              var singleTrixel = [
              
                { x: World.allStoredTrixelPoints[p0].x, y: World.allStoredTrixelPoints[p0].y, z: 0 },
              
                { x: World.allStoredTrixelPoints[p1].x, y: World.allStoredTrixelPoints[p1].y, z: 0 },
              
                { x: World.allStoredTrixelPoints[p2].x, y: World.allStoredTrixelPoints[p2].y, z: 0 },
              
              ];

              temp_layer_outer.push(singleTrixel);

              World.allTrixels.push(singleTrixel);

          };
      
      };

      // Adding the inner layer
      MainNewLayer[1] = temp_layer_outer;


      World.layers.push(MainNewLayer);

}//makemagictrixels()

