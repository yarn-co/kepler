var Compile      = require('./Compile');
var Stickersheet = require('./Stickersheet');
var _ = require('lodash');

/*
*     
*  ========================================
*  Planet Finder!!!!
*  
*  This is a set of tools to process trixel viewers
*  and JSON data to build svgs in Nodejs
*  Revision : 3
*  
*  
*  New Version, Working out the +1 -1 issues
*  Kepler becomes an App name space and gets converted to
*  a stacking system for all of the other features that were crammed into it
*  Sticker sheet, bleed layer, Quantum cards, beautifier, Synthesizer
*  
*  
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
  padding: 0,
  bleedLayer: false,
  stickerSheet: true,
  // stickerSheet: false,
  // quantumCard: false,
  quantumCard: true,
  quantumCardData: {}
};

var Kepler = module.exports = function (json, options) {


    
    options = options || {};

    
    // Apply defaults
    _.defaults(options, defaults);
    
    var width = options.width || 300;
    
    if (json === null) {  
      throw new Error('Json object is null.');
    } 
    if(typeof json !== 'object') {
      throw new Error('Json object type != \'object\'. Json type = ' + typeof json + ".");
    }
    
    var layers = json.amountOfLayers;
    
    // Adjust layer count for different versions of json format
    // So if anyone resaves the version will convert to the newest version,
    // as of this writing it was at 3 and we dont need it then
    // So the only reason this is here is possibly that the database has to rebuild?
    // if (json.version === 1) {
    //     layers -= 2;
    // }

    if (json.version === 1) {
      // debugger
        layers -= 1;
    }

    // we are simply hacking in the Pan and zoom data here
    // it should be handled better after the refactor
    // "gridIndex":2,"zoomIndex":3
    var gridIndex, zoomIndex;
    if (typeof json.gridIndex === 'undefined') {
      gridIndex = 0;
    }else{
      gridIndex = json.gridIndex;
    }
    if (typeof json.zoomIndex === 'undefined') {
      // zoomIndex = json.amountOfLayers-1; // Ugggg +1
      zoomIndex = json.amountOfLayers; // Ugggg +1
    }else{
      // zoomIndex = json.zoomIndex +1; // AH
      zoomIndex = json.zoomIndex; // AH
    }
    


    
    var trixel = Compile({

      // rename to trixels
      trixels: json.trixels,
      // data: json.trixels,
      // rename to amountOfLayers
      layers: layers,
      
      amountOfLayers: layers,

      // hacking in the Pan and zoom data for the moment
      zoomIndex : zoomIndex,
      gridIndex : gridIndex,

      width: options.width,
      baseUnit: options.baseUnit,
      mergePaths: options.mergePaths,
      fillGaps: options.fillGaps,
      gradientBackground: options.gradientBackground,
      square: options.square,
      padding: options.padding,
      bleedLayer: options.bleedLayer,
      quantumCard: options.quantumCard,
      quantumCardData: options.quantumCardData
    });
    
    if(options.stickerSheet) {
        return Stickersheet(trixel, options.stickerSheet);
    } 
    // else if (){

    // }
    else {
        return trixel;
    }
};


