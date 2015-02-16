/*======================= 
  
    ONLY CHANGE HERE IS RENAMING // Triforce.MetaEngine.SunflowerLogic = (function(me){
    to // Kepler.SunflowerLogic = (function(me){
    
    ALSO known as Universe Expansion Big Bang But.
    However if you take apart a spiral you get two parts. Inner and outer.
    Inner being first, and inner being a shape of a sunflower.
    SOooooo The universe is a giant SUNFLOWER! YaY sunflowers! Banzai!!! *Shades* YEEEAAAAH!


=======================*/ 

/* 
*     
*    This builds a bunch of array lists and is a core tool for bulding the grid.
*    YOU SHOULD NOT HAVE TO TOUCH THIS FILE EVER AGAIN. IT RUNS ONCE AT START.
*    And some of the output is cached, but it does not save much time.
*    It has a lot of comments but needs illustrations.
*
*/


// v:5



/* 
*     
*    example of how to use these
var a = new MakeLevelPointCountFromTriangleNumbers(5);
// these two share the same level since they are used together
var b = TriangulateQuadrentEdges(2,a);
var c = BuildTrixelsIndexes(2,b)
*      
*       
*/

/* 
*     
*    Start these, but move them to the game file
*    todo: merge this into the triforce class
*       
*/
/*
// Example of who to use these

var level = 3;
var AA_ = new MakeLevelPointCountFromTriangleNumbers(12);

var triangulate = new TriangulateQuadrentEdges(level, AA_);

// pass the level and array to the building of the indexes
var trixelGrid = new BuildTrixelsIndexes(level,triangulate);

*/



    // Polygonal number, Triangular number
    /* 
    *     
    *    simply make the multiply numbers of each level radius of points
    *    This returns the multiplier of the points for each layer
        [0, 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78, 91, 105, 120, 136, 153, 171, 190]
        so [2] * 2 = 6 which  is out visual starting layer
        [0, 2, 6, 12, 20, 30]
        worldgrid.children[0].geometry.vertices.length-1
    *       
    */

    // simply 6 * level

    /* 
    *     
    *    Code name: Sunflower Logic, for the way the trixels are drawn in.
          For each layer they get drawn first in like a sunflower, and then another pass forms the edges
          for its outer side.
    *      
    *       
    */


// sunflower logic
// Triforce.MetaEngine.SunflowerLogic = (function(me){
Kepler.SunflowerLogic = (function(me){


    var segmentCountList = [0, 6, 12, 18, 24, 30, 36, 42, 48, 54];
    var segmentCountListOff = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    var showComputedData = true;
    var showComputedData = false;

    return {
      MakeTriangleNumbers : MakeTriangleNumbers,
      MakeLevelPointCountFromTriangleNumbers : MakeLevelPointCountFromTriangleNumbers,
      TriangulateQuadrentEdges : TriangulateQuadrentEdges,
      BuildTrixelsIndexes : BuildTrixelsIndexes,
    }

    function MakeTriangleNumbers (amountOfLayers) {
      this.amount = amountOfLayers || 12;
      var points_in_grid_level = [];
      for (var n = 0; n < this.amount; n++) {
        var y = n;
        // console.log( n + (y+1)  );
        var g = (n+1)*n/2;
        // var g = segmentCountList[n];
        points_in_grid_level.push(g);
        // console.log( g );
        // console.log("where");
        // console.log(points_in_grid_level);
        // returns every triangle number array in a new array starting from 0 to limit.
        // not used really, but great for example of the below more complicated function
      };
      return points_in_grid_level;
    }
    // MakeTriangleNumbers()






    // read more on Polygonal number, Triangular number
    /* 
    *     
    *    build from aboves function, make a list of numbers in the levels array radius
    *    Store the A_[] as a multidimentional array for retrevial and speed to not
         to rerun on every page load

         You should draw a grid map with points and write their number donw going in counter
         clockwise direction as a zero radial index
         It selects the most outer layer/level this example being 3 and then selects the previous
         and does a trangulation starting with the inner level then the outer layer
         building a multi multi dimentional array [[[]], [[]]] ...
         to list the edges of which there are six on every one.
         These store the inner and outer points so we can select them later for painting as well
         or other grid stuff

         This grid is out of date -1 each for now

       7
    8     16
 9     1     15
     2   6
       0
10   3   5   14
       4
  11      13
      12

    *    
    *     
    *    @arg number, build as many rings/levels/layers you would like
    *    @returns array

        // returns somethign like, it shifts the level up in the array
        // example level 3 starts at 7,
            var levels =  [  [0], // cause I dont want to get 0, and 1 mixed up oy...
            -- Feb 2015---- OH BUT IT DID>.... DID it Ever.....
                          [1,2,3,4,5,6], // 1
                          [7,8,9,10,11,12,13,14,15,16,17,18] // 2
    *       
    */


/* 
*     
*    this builds the layers count of points following a 6*n and triangular numbers
*    output should be
/*

_.range(0,7)      // 6/7         
_.range(7,20)    // 12/13        
_.range(20,39)  // 18/19         
_.range(39,64) // 24/25
// in index
_.range(0,1 or 6*1+1)      // 6/7

// we need the index+1 on the rig
_.range(6*0+0, 6*0+0)
_.range(6*0+0, 6*1+1)      // 6/7
_.range(6*1+1, 6*3+2)    // 12/1
_.range(6*3+2, 6*6+3)  // 18/19
_.range(6*6+3, 6*10+4) // 24/25
_.range(6*10+4, 6*15+5) // 30/31


*       
*/
 function MakeLevelPointCountFromTriangleNumbers(times,index,previousIndex,level){
    var g = 0;
    var pg = 0;
    var index = 0;
    var previousIndex = 0;
    var layers = [];
    var temp = [];
    // get the range rather the count of points in teh layer including the extra
    // _.range(6*0+0, 6*1+1)
    for (var n = 0; n < times; n++) {
      temp = [];
      count = 0;
        // triangular number, see wikipedia
        g = (n+1)*n/2;
        /*
        g = (n+1)*n/2;n++;g;
        */
    /*console.log("g", g);
    console.log("pg", pg);
    console.log("(6*pg)+index", 6, pg, " + ", previousIndex, "    ", "6*g+(index+1)", 6, g, "+", index, "+1" );
    console.log("---", (6*pg)+previousIndex, "    ", (6*g)+index );
    */

        var count = _.range( (6*pg)+previousIndex, (6*g)+index );
        // temp.push(count);
        layers.push(count)

        pg = g;
        previousIndex = index;
        index++;
    }
     // layers.push(count)

    // layers.push(temp)
    return layers;
}



/*console.log("==================");
for (var i = 0; i < a.length; i++) {
    console.log(a[i]);
  // for (var w = 0; w < c[i].length; w++) {
    
  // };
};
*/






function TriangulateQuadrentEdges(level,levelsList){
  /* 
  *     
  *    we simply want to return grouppings of the edges points in arrays
  *    example. a = [1, 2, 3, 4, 5, 6, 7]
     so we want [ [1,2], [2,3], [3,4], [4,5], [5,6] ]

     --- Note this only returns one layer, should it return all?

  *       
  */
    var A_ = levelsList;
    var innerEdge = [],
        outerEdge = [],
        tempArray = [];

    // get current level
    var edges = A_[level];
    
    // use as a 0 index, edge_and_quardrent
    var eq = 0;
   
    /* 
    *     
    *   wrapping shifts the current edge your on and then loops
        to build lists of its current working quadrant 
    *       
    */
        
        /* =======================
            current level
         ======================= */
        // edge size
        // get level + 1 always 1 more then the previous
        // which means we just calculate the ammount once.
        // later we shift the the next edge so offset the 0?

        // quadrant iterrate on each edge of 6
        for (var y = 0; y < 6; y++) {
          var temp = [];
          // var shift = (y+eq)*level;
          var shift = eq*level;
          eq++;
          // knowing the length, put the list of the edge into a broken up array
          for (var i = 0; i < level+1; i++) {
            var point = A_[level][i+shift] || A_[level][0];
            temp.push( point );
          };
          // contaion all edges arrays
          outerEdge.push(temp);

        };
        /*
          console.log("outerEdge 0",outerEdge[0]);
          console.log("outerEdge 1",outerEdge[1]);
          console.log("outerEdge 2",outerEdge[2]);
          console.log("outerEdge 3",outerEdge[3]);
          console.log("outerEdge 4",outerEdge[4]);
          console.log("outerEdge 5",outerEdge[5]);
        */
        
        /* =======================
            previous level
         ======================= */
        

        // quadrant iterrate on each edge of 6
        eq = 0;
        for (var y = 0; y < 6; y++) {
          var temp = [];
          // var shift = (y+eq)*level;
          var shift = eq*(level-1);
          // console.log("shift",shift);
          eq++;
          // knowing the length, put the list of the edge into a broken up array
          for (var i = 0; i < level; i++) {
            var point = A_[level-1][i+shift] || A_[level-1][0];
            // debugger
            temp.push( point );
          };
          // contain all edges arrays
          innerEdge.push(temp);

        };
        
        // var sjsd = '';
        /*for (var i = 0; i < 6; i++) {
          // console.log("innerEdge 0",innerEdge[i]);
          sjsd = sjsd + '['+ innerEdge[i] + '],'
        };
        var sjsdsjkdf = '';*/
        
        /*for (var i = 0; i < 6; i++) {
          // console.log("outerEdge 0",outerEdge[i]);
          sjsdsjkdf = sjsdsjkdf + '['+ outerEdge[i] + '],'
        };*/
      /*            
         console.log("innerEdge 0",innerEdge[0]);
         console.log("innerEdge 1",innerEdge[1]);
         console.log("innerEdge 2",innerEdge[2]);
         console.log("innerEdge 3",innerEdge[3]);
         console.log("innerEdge 4",innerEdge[4]);
         console.log("innerEdge 5",innerEdge[5]);
              */
        
        // console.log("?");
        // debugger
        return {
          innerEdge : innerEdge,
          outerEdge : outerEdge
        }


  }//TriangulateQuadrentEdges()




    /* 
    *     
    *   these return the calculated layers inner and outer vertice indexes calculated like a trixel
        but does not actually have vertice x,y,z, location points just the index's they will select
        return {
        previous_level_trixels : previous_level_trixels,
        current_level_trixels : current_level_trixels
        }
        previous_level_trixels[u][gg] [7, 20, 8]
        previous_level_trixels[u][gg] [8, 21, 9]
        this should select the 7th vertice now, or the first in teh level index?
    *       
    */
// var b = TriangulateQuadrentEdges(4,a);



    function BuildTrixelsIndexes(level,edgesArray){

      var outerEdge = edgesArray.outerEdge;
      var innerEdge = edgesArray.innerEdge;
      var previous_level_trixels = [];
      var previous_level_trixels_raw = [];
      var current_level_trixels = [];

      // if level 2 outerEdge[0] should be [7,8,9]

      /*
        itterate on each edge to add to quadrant store and build trixels
        in a counterclockwise motion, starting with the inner edges
        to make spikes like a sun, and then the outter as a ring like
      */

      /* =======================
          current level, the outter trixels
       ======================= */
       // if at level 2 I expect 2 trixels from the edge facing inwards [7,8,9]
       // so we want to calculate [ [7,8,0], [8,9,1] ]
        for (var eq = 0; eq < 6; eq++) {

          var o = 0,// reset the trixel build, needed?
              outterPoint = 0,
              innerPoint = 0,
              tempPoints = [];

              // get the given level 2 then build the 3 points 7,8,0
              // level determines the points in an edge + 1 or two lines for 2 trixels
            for (var o = 0; o < level; o++) {
              var tempz = [];
              // debugger
              // var lastinArrayOuter = outerEdge[eq][o+1] ;
              // var lastinArrayInner = innerEdge[eq][o];
              // build trixels array
              tempz.push( outerEdge[eq][o], outerEdge[eq][o+1], innerEdge[eq][o] );
              // then toss that array into the edges array, so 2 in the array [ [7,8,0], [8,9,1] ]
              tempPoints.push(tempz);
            };
            // then push that group into the master layers array
            current_level_trixels.push(tempPoints);
        };

    
        // print the edges and trixels for checking
        /*var opw = 0;
        var gg = 0;
        for (var p = 0; p < current_level_trixels.length; p++) {
            var t = current_level_trixels[p].length;
            opw = opw + t;
            gg++;
        };*/
        for (var x = 0; x < current_level_trixels.length; x++) {
          for (var r = 0; r < current_level_trixels[x].length; r++) {
            // super important console
            // console.log("current_level_trixels[u][gg]", current_level_trixels[x][r]);
          };
        };
    








      /* =======================
          previous level
       ======================= */

      for (var eq = 0; eq < 6; eq++) {

        var o = 0,
            outterPoint = 0,
            innerPoint = 0,
            tempPoints = [];

        // if at level 2 I expect 1 trixel
        for (var o = 0; o < level-1; o++) {
          // debugger
          var tempz = [];
          // var lastinArray = innerEdge[eq][o+1];
          tempz.push( innerEdge[eq][o], outerEdge[eq][o+1], innerEdge[eq][o+1] );
          tempPoints.push(tempz);

          // raw is just for looking at the output fast.
          previous_level_trixels_raw.push(innerEdge[eq][o], outerEdge[eq][o], innerEdge[eq][o+1]);
        };
        previous_level_trixels.push(tempPoints);
        // debugger
      };

     /* // print the edges and trixels for checking
      var opw = 0;
      var gg = 0;
      for (var p = 0; p < previous_level_trixels.length; p++) {
          var t = previous_level_trixels[p].length;
          opw = opw + t;
          // console.log(opw);
          // console.log("gg", gg);
          gg++;
      };*/
      if (showComputedData === true) {
        for (var x = 0; x < previous_level_trixels.length; x++) {
          for (var r = 0; r < previous_level_trixels[x].length; r++) {
            // important console
            console.log("previous_level_trixels[u][gg]", previous_level_trixels[x][r]);
          };
        };
      };

       var tempstring = '';
       for (var i = 0; i < previous_level_trixels.length; i++) {
         // console.log("innerEdge 0",innerEdge[i]);
         for (var u = 0; u < previous_level_trixels[i].length; u++) {
           tempstring = tempstring + '['+ previous_level_trixels[i][u] + '],'
           previous_level_trixels[i][u];

         };
       };
      // console.log(tempstring);
      /*
      var c = BuildTrixelsIndexes(3,b)
       [7,20,8],[8,21,9],[9,23,10],[10,24,11],[11,26,12],[12,27,13],
       [13,29,14],[14,30,15],[15,32,16],[16,33,17],[17,35,18],[18,36,7],
       */
       
       // for (var i = 0; i < 6; i++) {
       //   // console.log("outerEdge 0",outerEdge[i]);
       //   sjsdsjkdf = sjsdsjkdf + '['+ outerEdge[i] + '],'
       // };
       
// debugger
      return {
        previous_level_trixels : previous_level_trixels,
        current_level_trixels : current_level_trixels,
        previous_level_trixels_raw : previous_level_trixels_raw
      }
    
    }//BuildTrixelsIndexes()
    
    

}(Kepler || {}));



/*

  // this is the output of the levels list as an example

  [0,0,0],

  [1,8,2,2,10,3,3,12,4,4,14,5,5,16,6,6,18,1],
  [1,8,2,2,10,3,3,12,4,4,14,5,5,16,6,6,18,1],

  [7,20,8,8,21,9,9,23,10,10,24,11,11,26,12,12,27,13,13,29,14,14,30,15,15,32,16,16,33,17,17,35,18,18,36,7],

  [19,38,20,20,39,21,21,40,22,22,42,23,23,43,24,24,44,25,25,46,26,
  26,47,27,27,48,28,28,50,29,29,51,30,30,52,31,31,54,32,32,55,33,33,56,34,34,58,35,35,59,36,36,60,19],

  [37,62,38,38,63,39,39,64,40,40,65,41,41,67,42,42,68,43,43,69,44,
  44,70,45,45,72,46,46,73,47,47,74,48,48,75,49,49,77,50,50,78,51,51,79,52,52,80,53,
  53,82,54,54,83,55,55,84,56,56,85,57,57,87,58,58,88,59,59,89,60,60,90,37],

  [61,92,62,62,93,63,63,94,64,64,95,65,65,96,66,66,98,67,67,99,68,68,100,69,69,
  101,70,70,102,71,71,104,72,72,105,73,73,106,74,74,107,75,75,108,76,76,110,77,77,111,
  78,78,112,79,79,113,80,80,114,81,81,116,82,82,117,83,83,118,84,84,119,85,85,120,86,86,122,87,
  87,123,88,88,124,89,89,125,90,90,126,61],

  [91,128,92,92,129,93,93,130,94,94,131,95,95,132,96,96,133,97,97,135,98,98,136,
  99,99,137,100,100,138,101,101,139,102,102,140,103,103,142,104,104,143,105,105,
  144,106,106,145,107,107,146,108,108,147,109,109,149,110,110,150,111,111,151,112,112,152,113,113,
  153,114,114,154,115,115,156,116,116,157,117,117,158,118,118,159,119,119,160,120,120,161,121,121,163,
  122,122,164,123,123,165,124,124,166,125,125,167,126,126,168,91],

  ];




   
      
  // cache of the radials base numbered points levels
       
        
  
  var baselevel_0 =  [];
  var baselevel_2 = [1, 2, 3, 4, 5, 6];
  var baselevel_3 = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  var baselevel_4 = [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];
  var baselevel_5 = [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60];
  var baselevel_6 = [61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90];
  var baselevel_7 = [91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126];
  var baselevel_8 = [127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168];
  var baselevel_9 = [169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216];
  var baselevel_10 = [217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270];
  var baselevel_11 = [271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330];


   
      
  // level 3's edges
       
        
  

  var zinnerEdge_3 = [ [1,2],[2,3],[3,4],[4,5],[5,6],[6,1] ]
  var zouterEdge_3 = [ [7,8,9],[9,10,11],[11,12,13],[13,14,15],[15,16,17],[17,18,7] ]


   
      
  // level 3
       
        
  
  var zfullTri_3 = [ [7,20,8],[8,21,9],[9,23,10],[10,24,11],[11,26,12],[12,27,13],
     [13,29,14],[14,30,15],[15,32,16],[16,33,17],[17,35,18],[18,36,7], ]


*/
