var Compile      = require('./Compile');
// var Stickersheet = require('./Stickersheet');
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
  quantumCard: false,
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
    // So if anyone re-saves the version will convert to the newest version,
    // This will handle rebuilding from the data base and 
    // printing older stickers
    // if (json.version === 1) {
    //     layers -= 2;
    // }
    var zoomIndex;

    if (json.version < 3) {
        layers -= 1;
        zoomIndex = layers;
        console.log(zoomIndex, layers, "Z L");
    }
    // zoomIndex historically has never been undefined
    // however there was a while where zoom and amount were 2 apart
    // so we need to match from a mutated layers above
    else if (typeof json.zoomIndex === 'undefined') {
      // zoomIndex = json.amountOfLayers;
      zoomIndex = layers;
    }
    // the most recent and proper way in Kepler and Triforce
    else {
      zoomIndex = json.zoomIndex
    }

    var gridIndex;
    if (typeof json.gridIndex === 'undefined') {
      gridIndex = 0;
    }else{
      gridIndex = json.gridIndex;
    }

   

    
    // var trixel = Compile({
    return Compile({

      // rename to trixels
      trixels: json.trixels,
      // data: json.trixels,
      // rename to amountOfLayers
      layers: layers,
      
      amountOfLayers: layers,

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

      quantumCardData: options.quantumCardData,

      stickerSheet: options.stickerSheet

    });

    // moved the sticker sheet or singles modes to compile

};


