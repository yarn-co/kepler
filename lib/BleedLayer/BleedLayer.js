


// var THREE = require('three/three.min.js');
var DataModel = require('../DataModel.js');
// var visualTools = require('./visualTools.js');


/*======================= 
  
    Dont have any functions here yet, or at all
    the routines are handled in various other functions
    
    So this just handles making the model
    
=======================*/ 


var BleedLayer = module.exports = function() {
	
	// see file for the properties
	DataModel.call(this);

	this.like = null; // this is for the offset routine

}