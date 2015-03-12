var Compile 	 = require('./Compile');
var _ = require('lodash');

/* 
*     
*  ========================================
*  Planet Finder!!!!
*  
*  This is a set of tools to process trixel viewers
*  and JSON data to build svgs in Nodejs
*  
*  
*/

var defaults = {
  width: 300,
  baseUnit: 14,
  mergePaths: false,
  fillGaps: false,
  gradientBackground: false,
  square: false,
  padding: 0
}

var Kepler = module.exports = function (json, options) {
	
	options = options || {};
	
	// Apply defaults
	_.defaults(options, defaults);
	
	var width = options.width || 300;

	if (json === null || typeof json !== 'object') {
	  
	  throw new Error('Must provide json as a plain object.');
	}

	var layers = json.amountOfLayers;

	// Adjust layer count for different versions of json format
	if (json.version === 1) {
		layers -= 2;
	};

	return Compile({
	  data: json.trixels,
	  layers: layers,
	  width: options.width,
	  baseUnit: options.baseUnit,
	  mergePaths: options.mergePaths,
	  fillGaps: options.fillGaps,
	  gradientBackground: options.gradientBackground,
	  square: options.square,
	  padding: options.padding
	});
	    
}
