
/*======================= 
  
    THE ONLY CHANGE HERE WAS THE NAME
    Triforce.MetaEngine.BuildSubdividePoints
    To
    Kepler.BuildSubdividePoints
      
=======================*/ 


/* 
*     

	This is to build subdivide points ON THE EDGES of the trixels
	An edge being the line space inbetween two points
	


*    need to say, 
let level be: 3
so one subdivide will give 3 points (one extra level - 2) for each edge
for each edge point of 6 make 0 1 2 3 4 5 6
subdivide([0.x.y.z, 1.x.y.z])
returns THREE.Vector3 {x: 17.446367753846154, y: 39.124153846153845, z: 0 }

next routine was to take first point + new points list + last
making [0,1new,2new,3new,(1)]	(1) being the original of the last and the next to start from
so again [4,5new,6new,7new,(5)] 5 repeats here....
for 6 [0,1], [1,2], [2,3], [3,4], [4,5], [5,6]
need to toss the matching pairs since extra points are pointless
	while i
		push new to array
		[0,last]
		cache last, pop last
		start on last
		at 6 here, check for last, so if i === 6 keep 6
*      
*       
*/

/*
var arrayList = [0,1,2,3,4,5,6];
var level = 3;
var level = 4;
var level = 5;
var edgeindex = 0;
var superTemp = [];


NOTE: was called Kepler.BuildSubdividePoints

*/

// Kepler.BuildSubdividePoints = {};
// Triforce.Build_Subdivide_Points_On_Trixel_Edge = {};

var BuildSubdividePoints = module.exports = { REVISION: '6' };


/* 
*   
*      
*       
*/
BuildSubdividePoints.init = function(args) {
    
    var currentlevel = args.currentlevel;
    var currentedgeindex = args.currentedgeindex;
    var currentVerts = args.currentVerts;
    var parentObject = args.parentObject;
    
    var start = new BuildSubdividePoints.core({
      level : currentlevel,
      // level : 2,
      edgeindex : currentedgeindex,
      // originalArrayList : [0,1,2,3,4,5,6]
      originalArrayList : currentVerts // built from BuildMultipleLayersOfHexCircles()
    });
    var dopoints = start.startNewPoints(6);
    var compressed = new start.compress(dopoints,6);
    var f = new start.flattenSuperList(compressed);

    /* 
    *     
    *    do a test on a circle
    *    
    *       
    */
    // debugger
    // TODO: whatsup with this?  _TrixelsDNA?!
    if (args.Global._TrixelsDNA.logComputedPoints === true) {
      // console.log("=========  starting all computed points ");
      for (var i = 0; i < f.length-7; i++) {
        // // console.log(f[i]);
      };
    };

  

    // console.log("Go?================");

    return f;
};//PerformSubdivide()


BuildSubdividePoints.core = function(args) {
	// console.log("====== core box ======");
	this.level = args.level;
	this.edgeindex = args.edgeindex;
	this.originalArrayList = args.originalArrayList;
	this.superTemp = [];

	// debug console
	this.DEBUG = true;
	this.DEBUG = false;

	return this;
}

BuildSubdividePoints.core.prototype = {
    
	constructor: BuildSubdividePoints.core,

	startNewPoints : function(limitedges){
		var limit = limitedges || 6;
		
		// // console.log("========= starting new edges =========");
		// do magic on each edge
		for (var i = 0; i < limit; i++) {
			// make temp array of new points for the edge
			var temp = [];
			// changing from start 0 to 1 and dropping teh level.... old code that worked.
			// for (var t = 0; t < this.level-2; t++) {
			for (var t = 1; t < this.level-1; t++) {
				/*
				basic text output debug
				var text = t+this.edgeindex+'p';
				temp.push(text);
				*/
				// logic using subdivide code
				var newpoints = new this.subdivide( this.originalArrayList,
													this.level,
													this.edgeindex,
													t);
				temp.push(newpoints);
			};
			/*
				temp should be between this
				[THREE.Vector3 		x: 0 				  y: 10 			   z: 0
				THREE.Vector3 		x: -8.660254037844386 y: 5.000000000000001 z: 0
			*/
			// join with the first and last point of that edge
			var o = new this.buildUp(temp, this.edgeindex, this.originalArrayList);

			// add the new list to the super list

			this.superTemp.push(o);
			this.edgeindex++;
		};
		if (this.DEBUG === true) {
			// show supertemp list in console
			// console.log("========= showing super temp =========");
			for (var i = 0; i < this.superTemp.length; i++) {
					// // console.log(this.superTemp[i]);
			};
		};
		return this.superTemp;
	},

	/*
		we dont need the duplicate point at each edge to start from again
		compress the new arrays into one as a points list by removing
		the last point in each array until the last one.

		@returns for level 5
		[0, "0p", "1p", "2p"]
		[1, "1p", "2p", "3p"]
		[2, "2p", "3p", "4p"]
		[3, "3p", "4p", "5p"]
		[4, "4p", "5p", "6p"]
		[5, "5p", "6p", "7p", 6]
	*/
	compress : function(superTemp, limitedges){
		var limit = limitedges || 6;
		// // console.log("========= compressing =========");

		for (var i = 0; i < limit; i++) {
			var temp = [];
			if (i != limit-1) {
				superTemp[i].pop();
			};
			if (this.DEBUG === true) {
				// // console.log(superTemp[i]);
			}
		};
		return superTemp;
	},

	buildUp : function(list_array, edgeindex, originalArrayList){
		this.edgeindex = edgeindex;
		this.list_array = list_array;
		this.originalArrayList = originalArrayList;
		// // console.log("========= building up =========");

		var a = this.originalArrayList[0+this.edgeindex];
		var b = this.originalArrayList[1+this.edgeindex];
		list_array.unshift(a);
		list_array.push(b);
		return list_array;
	},

	flattenSuperList : function(array){
		var f = _.flatten(array);
		if (this.DEBUG === true) {
			// console.log("========= flattening super temp =========");
			// // console.log(f);
		};
		return f;
	},


	/* 
	*     
	*    subdivide
	*      
	*       
	*/
   	subdivide : function(twopoints, level, index, i){
   		// @returns an x,y,z for the current segment point thats being itterated on
   		// THREE.Vector3 {x: 17.446367753846154, y: 39.124153846153845, z: 0, constructor: function, set: function…}
   		
   		var x1 = twopoints[0+index].x;
   		var x2 = twopoints[1+index].x;
   		var y1 = twopoints[0+index].y;
   		var y2 = twopoints[1+index].y;
   		var z1 = twopoints[0+index].z;
   		var z2 = twopoints[1+index].z;

   		// formula -> (startPoint.x +  ( (endPoint.x - startPoint.x) /  totalSegments) * segment);
       	var midPoint = [];
       	midPoint[0] = (x1 + ((x2 - x1) / (level-1) ) * i );
       	midPoint[1] = (y1 + ((y2 - y1) / (level-1) ) * i );
       	midPoint[2] = (z1 + z2) / (level-1);
       	// debugger
       	// var v = new THREE.Vector3(midPoint[0],midPoint[1],midPoint[2]);
       	var v = {x:midPoint[0],y:midPoint[1],z:midPoint[2]};
       	return v;
   	}




}// Kepler.BuildSubdividePoints.core.prototype()
