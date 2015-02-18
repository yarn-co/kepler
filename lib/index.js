var Compile 	 = require('./Compile');
var WorldBuilder = require('./WorldBuilder');

/* 
*     
*  ========================================
*  Planet Finder!!!!
*  
*  This is a set of tools to process trixel viewers
*  and JSON data to build svgs via an offline process
*  
*  
*  
*  
*  
*/

/*======================= 
  
       a = new Kepler({
    		width : 400,
    		JSON_Data : JSONY,
    		autoScale : true,
    		display : true,
    		dataType : 'JSON'
       })
       a = new Kepler({
    		width : 400,
    		JSON_Data : 'http://api.trixel.io/trixels/65',
    		//JSON_Data : 'http://api.trixel.io/trixels/27',
    		autoScale : true,
    		display : true,
    		dataType : 'AJAX'
       })
		
	// static
       a.svgElement
    // ajax
       Kepler.svgElement

 // Temporary solution to the levels count issue throughout Core
 // JSON exports have amountOfLayers two higher then trixels count
 // proof against Kepler.totalLayersCount(12) 

=======================*/ 

var Kepler = module.exports = function (args) {
	// this.adjusterUnit = args.adjusterUnit || 0.01;

	
	args.dataType = args.dataType || "json";
	  
	this.JSON_Data = args.JSON_Data;
	
	return work.call(this);
	
	function work () {
	  
		this.autoScale = args.autoScale || false;

		this.width = args.width || 300;

		this.wrapper = args.display || false;

		// Simple AJAX getter

		
		// we SUUUUPER dont want to be calling JSON.parse(JSON_SOURCE twice
		// once the levels issue is fixed

		if (typeof this.JSON_Data === 'undefined'){
			console.warn("!!! MUST PROVIDE JSON !!!");
		  return;
		}

		if (args.dataType.toLowerCase() === "string") {
		  
			var DATA_Parsed = JSON.parse(this.JSON_Data);
		}
		else if (args.dataType.toLowerCase() === "json") {
		  
			var DATA_Parsed = this.JSON_Data;
		}

		var levelsFix = 0;

		this.levels = DATA_Parsed.amountOfLayers;

		if (DATA_Parsed.version === 1) {
			levelsFix = 2;
			this.levels -= levelsFix;
		};

		var planet = WorldBuilder.init(this.levels, 14);
		// Compile = function (baseWidth, layersIn, SCALE_TYPE, TRIXELS_GEOMETRY, JSON_SOURCE, BASE_UNIT, DIV_WRAPPER) {
		// return Compile(this.width, this.levels, this.autoScale, planet, this.JSON_Data, 14, this.wrapper);

		return Compile({
		  baseWidth : this.width,
		  layersIn : this.levels,
		  scaleType : this.autoScale,
		  trixelsGeometry : planet,
		  JSONSource : DATA_Parsed,
		  // baseUnit : args.baseUnit,
		  divWrapper : this.wrapper
		});
	    
	}
}


// Kepler.dataOut = {};

/*======================= 
  
    Debug tools
      
=======================*/ 

Kepler.buildWithControl = function (level) {
	// level = 12
	var planet = WorldBuilder.init( level ,14);
	Compile(300, level ,true, planet, JSONY);
}


// tester to see if Kepler.WorldBuilder.init( level ,14);
// .all returns the same count as JSON.parse(args.data).trixels.length
Kepler.totalLayersCount = function (times) {
	// get total of layers count
	y = 0;
	n = 6;
	starter = 6;
	for (var i = 0; i < times; i++) {
		n = n + 12;
		y = n + y;
		console.log(y + starter);
	};
}




