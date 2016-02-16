
// remove the up link after this gets moved out of a symlink
// var THREE = require('../three/three.min.js');
var THREE = require('three/three.min.js');
var geometryTools = require('../geometryTools.js');
/*======================= 
  
    And NOW!!!!! DA BARRIER TEST!!!
      
=======================*/ 

var getMiniBarrierData = module.exports = {

	getAllGeometry : function(barrier, trixelsList) {

		var data = {
			trixelsIn : [],
			trixelsOut : [],
		}
		var len = trixelsList.length;
		for (var i = 0; i < len; i++) {

			var t = trixelsList[i]
			var center = t.centroid;

			// mini barrier test
			var m_ = geometryTools.isPointInPoly( barrier.vertices, center);
			if (m_ === true) {
				data.trixelsIn.push(t);
			}
			else {
				data.trixelsOut.push(t);
			}

		};
		
		return data;

	},




	 display : function(trixelsList) {
	 // displayTrixelsInMiniBarrier : function(trixelsList) {
		// hide the out trixels
		var len = trixelsList.trixelsOut.length;
		for (var i = 0; i < len; i++) {
			var t = trixelsList.trixelsOut[i].trixelMesh;
			t.material.transparent = true
			t.material.opacity = 0
		};
		// Triforce.renderOnce()
		// show the in trixels
		var len = trixelsList.trixelsIn.length;
		for (var i = 0; i < len; i++) {
			var t = trixelsList.trixelsIn[i].trixelMesh;
			t.material.transparent = true
			t.material.opacity = 1

		};

		// Triforce.renderOnce()

	},


	/*======================= 
	  
	    Toggle all trixels, a debugging tool
	    @toggle 'show', 'hide'
	=======================*/ 
	
	hideShowAll : function(toggle, trixelsList) {
		
		var len = trixelsList.length;
		for (var i = 0; i < len; i++) {
			var t = trixelsList[i].trixelMesh;

			if (toggle === 'show') {
				t.material.transparent = true
				t.material.opacity = 1
			}
			else {
				t.material.transparent = true
				t.material.opacity = 0
			}

		};
	}




}

