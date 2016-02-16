

var THREE = require('three/three.min.js');
var DataModel = require('../DataModel.js');
var visualTools = require('./visualTools.js');

/*======================= 
  
    Main tool

    Synthesizer_Z = new Synthesizer();

    // build data
    Synthesizer_Z.buildDataTable(TRIXELS_DATA)
    Synthesizer_Z.copyAllColors(FILE_DATA)
		
      
=======================*/ 

var Synthesizer = module.exports = function(){
	
	// see file for the properties
	DataModel.call(this);

	this.factorMutator = null; // this is for the offset routine
	
}

Synthesizer.prototype = {
	constructor: Synthesizer,

	/*======================= 
	  
	    make a list of centroids from each trixels geometry
	      
			we need to add these to te trixel data so we have correct indexes

			now has multi use moved to utilites for now
	=======================*/ 
	/*
	computeCentroids : function() {

		var len = this.TRIXELS_DATA.length;

		for (var i = 0; i < len; i++) {

			var trixel = this.TRIXELS_DATA[i].trixelVectors;
			var cen = geometryTools.computeCentroid(trixel);
			this.TRIXELS_DATA[i].centroid = cen;

		};
	
	},
	*/

	/*======================= 
	  
	    this can be merged with
	    the build routine mayeb

	    pass a list of trixels
	    "trixels":
	    [{"index":0,"color":"rgb(50,50,255)","opacity":1} ... ]
	      
	=======================*/ 
	/*
	copyAllColorsFromOriginal : function(originalTrixelList){

		var len = originalTrixelList.length;
		for (var i = 0; i < len; i++) {
			
			var color = originalTrixelList[i].color;
			
			var o = originalTrixelList[i].opacity;
			// debugger
			this.TRIXELS_DATA[i].color = {
				color : new THREE.Color().setStyle(color),
				opacity : o
			}

		};

		return this.TRIXELS_DATA;
	},

*/

	/*======================= 
	  
	    rebuilding the mesh from the selected trixels from the barrier
	    Or rather making a new set of meshes since we are not moving the mesh

	=======================*/ 
	rebuildMeshesAndColors : function(selectedTrixels) {

		var len = selectedTrixels.trixelsIn.length;
		for (var i = 0; i < len; i++) {
			
			var t = selectedTrixels.trixelsIn[i].trixelMesh;

			var newTrixel = visualTools.createTrixel(t.geometry.vertices);
			
			newTrixel.material.color.copy(t.material.color);
			
			this.trixelMeshesNewSet[i] = newTrixel;
			
			// worldForSynth.add( SynthesiedData.trixelMeshes[i] );
			
			// this.trixelPlainVerctorsNewSet[i] = newTrixel.geometry.vertices;

		};
		
		return this.trixelMeshesNewSet;
	},


	/*======================= 
	  
	    this returns the x,y, of the gridIndex hitzones location center of the Pan and zoom offset
	    its used to move the geometry back to the center
	      
	=======================*/ 
	
	computeOffsetFactor : function(offsetPoint, zeroCenterPoint) {
		// factor = new THREE.Vector3().subVectors( zeroCenter, superCenterCircle.position )
		// return new THREE.Vector3().subVectors( superCenterCircle.position, zeroCenter )

		var zeroCenter = new THREE.Vector3();
		zeroCenter.x = zeroCenterPoint.x;
		zeroCenter.y = zeroCenterPoint.y;
		zeroCenter.z = zeroCenterPoint.z;

		this.factorMutator = new THREE.Vector3().subVectors( offsetPoint, zeroCenter );
		return this.factorMutator;

	},

	/*======================= 
	  
	    this moves the geometry meshes to the center
	      
	=======================*/ 
	
	realignGeometry : function() {

		// move the VERTICES
		var len = this.trixelMeshesNewSet.length;
		for (var i = 0; i < len; i++) {
			var t = this.trixelMeshesNewSet[i];
			var len2 = t.geometry.vertices.length;
			for (var g = 0; g < len2; g++) {
				t.geometry.vertices[g].sub(this.factorMutator);
			};
		};


		return this.trixelMeshesNewSet;
		
	},


}
