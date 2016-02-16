
// remove the up link after this gets moved out of a symlink
var THREE = require('three/three.min.js');

/*======================= 
  
    Geometry Tools
      
=======================*/ 

var geometryTools = module.exports = {
	

	// // ok so now need centroid points
	// // direct copy from Triforce
	// computeCentroid : function(trixelVertices_) {
	//  var centroid = new THREE.Vector3();
	//  centroid.copy( trixelVertices_[0] )
	//  .add( trixelVertices_[1] )
	//  .add( trixelVertices_[2] )
	//  .divideScalar( 3 );
	//  return centroid;
	// },



	// MIGHT not be used now that we have trixels data
	// So now we need to compute the trixels from points
	// Direct copy from triforce
	GPUOffsetVal: function(id) {

		var temp = [];
		// var id = 1;
		var indexOffset = id * 3;
		for (var i = 0; i < 3; i++) {
			// console.log("index", indexOffset + i);
			temp.push(indexOffset + i);
		};
		return temp;

	},




	/* 
	*     
	*    point in polygon test
	*    SUPER core function 
	*       
	*/
	//+ Jonas Raoni Soares Silva
	//@ http://jsfromhell.com/math/is-point-in-poly [rev. #0]
	isPointInPoly : function(poly, pt){
	  for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
	  ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
	  && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
	  && (c = !c);
	  return c;
	},


}
