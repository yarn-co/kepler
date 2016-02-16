

var THREE = require('three/three.min.js');

/*======================= 

  the basic dataModel we'' use across the pipeline
  

  var a = function () {
  	this.tacos = "narf"
  	DataModel.call(this)
  	return this
  }

	v = new a()
	b = new a()

	v.barrier = {x:"fish"}
	
	b.barrier = {y:"weee"}


=======================*/ 

var DataModel = module.exports = function(){
	
	this.UUID = 'DataModel_'+THREE.Math.generateUUID();
	this.TRIXELS_DATA = [];
	// sample data in TRIXELS_DATA
	// this.TRIXELS_DATA[i] = {
	// 	id: i,
	// 	trixelVectors: V,
	// 	centroid: {},
	// 	color : {},
	// 	// specials ONLY FOR DEBUGGING, dont go making these in production
	// 	centroidMesh: {},
	// 	trixelMesh: {},
	// };

	this.SPLIT_LIST = []; // ?? think this has been moved to layerSplitter
	this.barrier = null;
	this.worldForSynth = null;
	this.trixelMeshesNewSet = []; // needs a smarter title, it gets filled up further down after the barrier
	
	// working this one out now
	this.trixelPlainVerctorsNewSet = []; 
	
	this.selectedTrixels = [];

	this.exportMeshes = function() {
		var len = this.TRIXELS_DATA.length;
		var T = [];
		for (var i = 0; i < len; i++) {
			T.push(this.TRIXELS_DATA[i].trixelMesh);
		};
		return T;
	}


	/*======================= 
	  
	    @OriginalGeometry is the original World Geometry
	    of which is not a THREE geometry
	    
	=======================*/ 
	
	this.buildDataTable = function(importingTrixels) {
		
		var len = importingTrixels.length;
		var poolVector;
		for (var i = 0; i < len; i++) {
			
			var t = importingTrixels[i];

			this.TRIXELS_DATA[i] = {
				id: i,
				// trixelVectors: V,
				centroid: {},
				// color : {},
				// specials ONLY FOR DEBUGGING, dont go making these in production
				centroidMesh: {},
				trixelMesh: t,
			};

		};

		// return this.TRIXELS_DATA;

	}

	return this;

}

