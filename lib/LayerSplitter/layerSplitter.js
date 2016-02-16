

var visualTools = require('../Synthesizer/visualTools.js');
// remove the up link after this gets moved out of a symlink
// var THREE = require('../three/three.min.js');
// var THREE = require('three/three.min.js');
var getCrossingVectors = require('../toolsVarious/crossvectors.js');


/*======================= 
  
    here we'll patch into the circle builder and get a layer splitter size
    ring = LayerSplitterModified(2,'r',true)

    g = new LayerSplitterModified()
    g.build(8,'r',true)
=======================*/ 

var layerSplitter = module.exports = function() {
  this.fish = 'sticks';
  this.Grr = "ehhhh";
}

layerSplitter.prototype = {
  constructor: layerSplitter,

  build : function(layer, color, display) {
    var trixelUnit = 14;
    var radius = (trixelUnit * layer) - (trixelUnit/2);
    color = color || 'r';
    if (display) {
      display = true;
    } else {
      display = false;
    }
    
    // debugger

    this.ring = visualTools.buildHexCircle(radius, color, display);
    return this.ring;
  },



  /*======================= 
    
      tests the rings geometry and returns trixels in its path
    expensive in that it does not stack with anything
    so if you do several of these they each have their own iterate stacks
        
        Ring = new LayerSplitterModified()
        splitterRing = Ring.build(2,'r',true)

  list = getTrixelsInRing(splitterRing, Trixels_Objects_list)
  =======================*/ 


  getAll : function(trixels) {

    var picksList = [];
    
    var len = trixels.length;
    for (var i = 0; i < len; i++) {
      
      var trixel = trixels[i].trixelMesh.geometry.vertices;
      
      var test = this.getSingle(trixel, this.ring);
      
      if (test === 1) {
      
        picksList.push(trixels[i]);
      
      };

    };
    // debugger
    // picksList.length

    return picksList;
  },


  /*======================= 
    
      getSingleTrixelInRing(Trixels_Objects_list[8], splitterRing)
        
  =======================*/ 
  /*
  var lllist = getTrixelsInRing(splitterRing, Trixels_Objects_list)

  var len = lllist.length;
  var color = Math.random()*0x9aff52
  for (var i = 0; i < len; i++) {
    var t = lllist[i];
    t.material.color.setHex(0x9aff52)
    // t.material.color.setHex(color)
  };
  */
  getSingle : function(trixelVertices, ring) {

      var len = ring.geometry.vertices.length;
      for (var i = 0; i < len-1; i++) {
      var crossVector = [];
      crossVector[0] = ring.geometry.vertices[i];
      crossVector[1] = ring.geometry.vertices[i+1];
        
        var test = this.testIfTrixelIsInCrossVector(crossVector, trixelVertices);
        if (test === 1) {
          return 1;
        }
      };

      return -1;

  },


  /*======================= 
    
     @crossVector a 2 length array of coords [{x,y}, {x,y}]
     @vertices 3 vector array that make up a trixel
     @GPU_ID the trixels Sunflower_id
        
  =======================*/ 
  // THREE.Line.prototype.testIfTrixelIsInCrossVector = function(crossVector, vertices, GPU_ID) {
  testIfTrixelIsInCrossVector : function(crossVector, vertices) {
    var a = getCrossingVectors.crossingVectors(vertices, crossVector);
    if (a === 2 || a === 1) {
      return 1;
    }
    else{
      return -1;
    }
  }




}






