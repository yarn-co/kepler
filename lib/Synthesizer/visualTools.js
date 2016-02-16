
// remove the up link after this gets moved out of a symlink
// this version seems to be screwing up the return of the mesh
var THREE = require('three/three.min.js');

var visualTools = module.exports = {

  displayLayer : function(geoArray, color) {

     color = color || Math.random()*0xffffff;

     var geometry = new THREE.Geometry(),
         material = new THREE.LineBasicMaterial({ color: color, linewidth: 4 });

     var len = geoArray.vertices.length;
     for (var i = 0; i < len; i++) {
       
       geometry.vertices.push(geoArray.vertices[i]);

     };

     return new THREE.Line( geometry, material );

   },


  createTrixel: function(geoArray) {
    var trixel = new THREE.Shape();
    // tri
    var cords = {
      v0 : [geoArray[0].x, geoArray[0].y],
      v1 : [geoArray[1].x, geoArray[1].y],
      v2 : [geoArray[2].x, geoArray[2].y]
    }

    trixel.moveTo(  cords.v0[0], cords.v0[1] );
    trixel.lineTo(  cords.v1[0], cords.v1[1] );
    trixel.lineTo(  cords.v2[0], cords.v2[1] );
    trixel.lineTo(  cords.v0[0], cords.v0[1] ); // close path, this is wrong but could break stuff right now



    var geometry = new THREE.ShapeGeometry( trixel );
    var mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: Math.random()*0xffffff } ) ) ;

    // scene.add( mesh );

    return mesh;
  },


  // a = drawDisplayCircleSingle({x:0,y:0}, 12,'r')
  drawDisplayCircleSingle : function(center, radius, color){
      var parent = scene;
      radius = radius || 2
      if (color) {
        if (color === 'r') {
          color = Math.random()*0xffffff;
        };
      }
      else{
        color = color || 0x5D46F2
      }
      var displayCircle = new this.solidCircle({ radius: radius, 
        segments: 15, color: color
      });
    
      displayCircle.position.copy(center);
      displayCircle.position.z = 16
      displayCircle.material.transparent = true
      displayCircle.material.opacity = 0.6
      parent.add(displayCircle);
      return displayCircle;

  },



  solidCircle : function(args){
   
    this.radius = args.radius || 6;
    this.segments = args.segments || 6;
    this.color = args.color || 0xff0000;

    var circle = new THREE.Shape();
    var radius = 6;

     for (var i = 0; i < this.segments; i++) {
       var pct = (i + 1) / this.segments;
       var theta = pct * Math.PI * 2.0;
       var x = this.radius * Math.cos(theta);
       var y = this.radius * Math.sin(theta);
       if (i == 0) {
         circle.moveTo(x, y);
       } else {
         circle.lineTo(x, y);
       }
     }

     var geometry = circle.makeGeometry();
     var material = new THREE.MeshBasicMaterial({ color: this.color });
     material.side = THREE.DoubleSide;
     var mesh = new THREE.Mesh(geometry, material);
     return mesh;

  },



  /*======================= 
    
      This was originally from Triforce but modified for Kepler
      
      ring = buildHexCircle(1, 'r', true)
      
      layer is whatever here and 14 is trixelUnit
      ring = BuildHexCircle(14*layer, 'r', true)


  =======================*/ 


  // Triforce.MetaEngine.TrixelGridBuilder.BuildHexCircle = function(args,trixelViewer){
  buildHexCircle : function(radius, color, display, linewidth){
    var trixelUnit = 14; // this is in Triforce.trixelUnit

    var radius = radius || trixelUnit;

    // webgl or somethign else does not allow higher then 1
    // no its broswer and card Dependant newer models can go to say 10
    // http://mattdesl.svbtle.com/drawing-lines-is-hard
    // linewidth = linewidth || 40;

    // dont change segmentCount for trixel hexagon designs
    var segmentCount = 6;
    if (color) {
      if (color === 'r') {
        color = Math.random()*0xffffff;
      };
    } else {
      var color = 0x520061;
    }

    var geometry = new THREE.Geometry(),
        material = new THREE.LineBasicMaterial({ color: color, linewidth: 10 });

    // goes counter clockwise from -theta since the grid finder is also
    // based on this direction
    for (var i = 0; i <= segmentCount; i++) {
          var theta = (i / segmentCount) * Math.PI * 2;
          geometry.vertices.push(
              new THREE.Vector3(
                  Math.sin(-theta) * radius,
                  Math.cos(-theta) * radius,
                  0));
    }
    
    var line = new THREE.Line( geometry, material );

    if (display) {
      scene.add( line );
    };
    return line;

  },





  /*======================= 
    
      Line
        
  =======================*/ 
  /*
  line = lineCreate(new THREE.Vector3(0,0,24), new THREE.Vector3(111,100,24))

  trixelUnit = 14
  layer = 2
  line = lineCreate(new THREE.Vector3(0,0,24), new THREE.Vector3(0, trixelUnit*layer, 24))
  scene.add( line );

  */

  lineCreate : function(start, stop, color) {
    if (color) {
      if (color === 'r') {
        color = Math.random()*0xffffff
      };
    }
    else {
      var color = 0x5291ff;
    }

    var geometry = new THREE.Geometry(),
        material = new THREE.LineBasicMaterial({ color: color, linewidth: 4 });

    geometry.vertices.push(start,stop);

    var line = new THREE.Line( geometry, material );
    return line;

  },





}

           



