
// var geometryTools = require('./geometryTools.js');
var THREE = require('three/three.min.js');

var mathTools = module.exports = {

  randomRGB : function() {
    
      function z() {
        return Math.floor(Math.random()*255);
      }
      
      return 'rgb('+z()+','+z()+','+z()+')';
  },

  // used to calculate the width of a trixel, in triangle terms the altitude
  calcWidthOfTrixel : function(BASE_UNIT) {
        
        return h = 0.5 * Math.sqrt(3) * BASE_UNIT;
  },

  // used to find the scalar for the trixel to fit the stage
  calcUnitScale : function(width, layersCount, BASE_UNIT, direction) {
    
        var unit;
        
        if (direction === "height") {
              
              unit = BASE_UNIT;
        } else {
          
              unit = this.calcWidthOfTrixel( BASE_UNIT );
        }
        
        return width / ( unit * ( ( layersCount ) * 2) );
  },

  // used to build the height as close as possible when the height is not known
  calcFullHeight : function(width, layersCount, BASE_UNIT) {
        
        var h = this.calcWidthOfTrixel( BASE_UNIT );
        // this layersCount is a global, it should not be
        var s = h * (width / ( h * ( ( layersCount ) * 2) ) );
        
        // find the difference of the lengths
        var a = (2 / Math.sqrt(3) ) * s;
        return a * (layersCount * 2);
  },


  /*======================= 
    
      make a list of centroids from each trixels geometry
        
      we need to add these to te trixel data so we have correct indexes

      now has multi use moved to utilites for now
  =======================*/ 

  computeCentroids : function(TRIXELS_DATA) {

    var len = TRIXELS_DATA.length;

    for (var i = 0; i < len; i++) {

      var trixel = TRIXELS_DATA[i].trixelVectors;
      var cen = this.computeCentroid(trixel);
      TRIXELS_DATA[i].centroid = cen;

    };
  
  },


  computeCentroidsFromMesh : function(TRIXELS_DATA) {

    var len = TRIXELS_DATA.length;

    for (var i = 0; i < len; i++) {

      var trixel = TRIXELS_DATA[i].trixelMesh.geometry.vertices;
      var cen = this.computeCentroid(trixel);
      TRIXELS_DATA[i].centroid = cen;

    };
  
  },


  // ok so now need centroid points
  // direct copy from Triforce
  computeCentroid : function(trixelVertices_) {
   var centroid = new THREE.Vector3();
   centroid.copy( trixelVertices_[0] )
   .add( trixelVertices_[1] )
   .add( trixelVertices_[2] )
   .divideScalar( 3 );
   return centroid;
  },


}