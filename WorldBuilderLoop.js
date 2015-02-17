
var SunflowerLogic = require('./copies_of_core/SunflowerLogic');

// TODO: what is this below?
/*======================= 
  
    [ { [{},{},{}] }, {} ]
      
=======================*/ 


var GridBuilderLoop = module.exports = function(World, level, cache) {
        
      // TODO: Why is this here?
      // var templayers = [];

      // var b = Triforce.MetaEngine.SunflowerLogic.TriangulateQuadrentEdges(level,cache);
      var b = SunflowerLogic.TriangulateQuadrentEdges(level, cache);
      // debugger
      
      // var c = Triforce.MetaEngine.SunflowerLogic.BuildTrixelsIndexes(level,b);
      var c = SunflowerLogic.BuildTrixelsIndexes(level, b);
// debugger
      // var sunIndex = trixelViewer._TrixelsDNA.SunflowerGridListInLayersIndex,
      // sunLayers = trixelViewer._TrixelsDNA.SunflowerGridListInLayers;
      /*======================= 
        
          previous layer loop
            
      =======================*/ 
      

      var temp_inner = [];
      
      var temp_I_layer = [];
      
      // length 6 is known, its the edges of the hexagon
      var temp_layer = [];
      for (var i = 0; i < 6; i++) {
      
          // This draws as many trixels were in the previous layer array
          for (var u = 0; u < c.previous_level_trixels[i].length; u++) {
              
              var mixcolor = Math.random() * 0xffffff;
      
              var thismap = c.previous_level_trixels[i][u];

              var p0 = thismap[0];
              var p1 = thismap[1];
              var p2 = thismap[2];
              // debugger
// console.log("a;lsmdds");
              // {vert,vert,vert}
              try {
                  
                  var singleTrixel = {
          
                    v0 : { x: World.allStoredTrixelPoints[p0].x, y: World.allStoredTrixelPoints[p0].y, z: 0 },
          
                    v1 : { x: World.allStoredTrixelPoints[p1].x, y: World.allStoredTrixelPoints[p1].y, z: 0 },
          
                    v2 : { x: World.allStoredTrixelPoints[p2].x, y: World.allStoredTrixelPoints[p2].y, z: 0 },
          
                  };
              }
              catch(err) {
                debugger
              } 
              
              // hence why we need to store the trixels instead of writing them to a world object
              // [{vert,vert,vert}, {vert,vert,vert} * n]
              temp_layer.push(singleTrixel);

              // // add to the layers group stack
              // temp_inner.push(sunIndex);
      
              // sunIndex++;

              // FK it, just add them to a world object for now
              World.all.push(singleTrixel);
          };

          // building inner layer
          // [ [{vert,vert,vert}, {vert,vert,vert} * n], ? ] 
          // temp_I_layer.push(temp_layer);
        // Kepler.WorldBuilder.world.layers.push(temp_layer);
          
      };

      // save the index as a layer set
      // temp_inner.push(temp_I_layer);
      temp_inner.push(temp_layer);
      
      /*======================= 
        
          current layer loop
            
      =======================*/ 
      
      // reset i and u
      var i = 0, u = 0;
      
      var temp_outter = [];
      
      for (var i = 0; i < 6; i++) {
      
          var mixcolor = Math.random() * 0xffffff;

          for (var u = 0; u < c.current_level_trixels[i].length; u++) {
      
              // testing to skip level 0 1
      
              // if(level != 1)
              var thismap = c.current_level_trixels[i][u];

              var p0 = thismap[0];
              var p1 = thismap[1];
              var p2 = thismap[2];
              


              // {vert,vert,vert}
              var singleTrixel = {
              
                v0 : { x: World.allStoredTrixelPoints[p0].x, y: World.allStoredTrixelPoints[p0].y, z: 0 },
              
                v1 : { x: World.allStoredTrixelPoints[p1].x, y: World.allStoredTrixelPoints[p1].y, z: 0 },
              
                v2 : { x: World.allStoredTrixelPoints[p2].x, y: World.allStoredTrixelPoints[p2].y, z: 0 },
              
              };

              // FK it, just add them to a world object for now
              World.all.push(singleTrixel);

              // add to the layers group stack
              // temp_outter.push(sunIndex);
              
              // sunIndex++;
        };
      
      };

      // save the index as a layer set
      // this looks to not be used
      // templayers.push(temp_outter);

      // sunLayers.push(templayers);

}//makemagictrixels()

