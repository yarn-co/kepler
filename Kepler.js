var Compile = require('./Compile');

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

var Kepler = (function(me) {
  return me;
}(Kepler || {}));


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

	if (args.dataType.toLowerCase() === "json") {
		this.JSON_Data = args.JSON_Data;
		// var that = this;
		var data = Kepler.data = work.call(this);
		// return work.call(this);
		return data;
	}
	else if (args.dataType.toLowerCase() === "ajax"){
		
		/*
		*  TODO: some pretty big inconsistencies, as to whether Kepler runs sync or asynchronously
		*  in this async case, kepler can't simply return an svg– it would instead need a callback.
		*
		*  Unless kepler needs to go async for any of its operations, I think we can assume it runs
		*  synchronously accepting parsed JSON, and that this ajax option will disappear.
		*  
		*/
		
		// Kepler.getJSON( args.JSON_Data , function(data) {
		// 	window.ajaxData = data;
		// }, function(status) {
		//   alert('Something went wrong.');
		// });

		Kepler.getJSON( args.JSON_Data ).then(function(data) {
			console.log("like!");
			this.JSON_Data = data;
			var a = work.call(this);
			return a;

		}, function(status) {

		  console.log("Arrrrrg space bunies have ruined the mission");

		})
		// trying to find the proper return timing for a = new Kepler
		.then(function (datas) {
			// debugger
			return Kepler.data = datas;
		})

	}

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

		if (args.dataType.toLowerCase() === "json") {
			var DATA_Parsed = JSON.parse(this.JSON_Data);
		}
		else if (args.dataType.toLowerCase() === "ajax") {
			var DATA_Parsed = this.JSON_Data.data;
		}

		var levelsFix = 0;

		this.levels = DATA_Parsed.amountOfLayers;

		if (DATA_Parsed.version === 1) {
			levelsFix = 2;
			this.levels -= levelsFix;
		};

		var planet = Kepler.WorldBuilder.init( this.levels ,14);
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
	var planet = Kepler.WorldBuilder.init( level ,14);
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




