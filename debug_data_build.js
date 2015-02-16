

var body = document.querySelector('body');
var LEVEL = 4;

/* ======================= */

var d_MakeLevelPointCountFromTriangleNumbers = 
document.querySelector('#MakeLevelPointCountFromTriangleNumbers');
// This has an internal level zero
var cache = Kepler.SunflowerLogic.MakeLevelPointCountFromTriangleNumbers( LEVEL );

for (var i = 0, len=cache.length; i < len; i++) {
  var canvas = document.createElement('p');
  var H = '['+cache[i].toString()+']';
  H = H.replace(/,/g,', ');
  canvas.innerHTML = H;
  d_MakeLevelPointCountFromTriangleNumbers.appendChild( canvas );
};

/* ======================= */


var d_TriangulateQuadrentEdges = 
document.querySelector('#TriangulateQuadrentEdges');
// This has an internal level zero
// var a = Kepler.SunflowerLogic.TriangulateQuadrentEdges( LEVEL );
for (var li = 0; li < LEVEL; li++) {
    // _TrixelsDNA.levels++;
    var T_ = Kepler.SunflowerLogic.TriangulateQuadrentEdges( li, cache );
    // console.log( T_ );
    // console.log("innerEdge", T_.innerEdge );
    // console.log( "outerEdge", T_.outerEdge );
    
    for (var i = 0, len = T_.length; i < len; i++) {
      // var canvas = document.createElement('p');
      // var H = '['+a[i].toString()+']';
      // H = H.replace(/,/g,', ');
      // canvas.innerHTML = H;
      // d_MakeLevelPointCountFromTriangleNumbers.appendChild( canvas );
      // console.log( "ds,fn",T_[i] );
    };
    
};
/*
for (var i = 0, len=a.length; i < len; i++) {
  var canvas = document.createElement('p');
  var H = '['+a[i].toString()+']';
  H = H.replace(/,/g,', ');
  canvas.innerHTML = H;
  d_MakeLevelPointCountFromTriangleNumbers.appendChild( canvas );
};*/


/* ======================= */




// body.appendChild(canvas);











function appendTo (id) {
  // var P = document.querySelector('#'+id);
  // // var canvas = document.createElement('div');
  // // item.id = 'K1';
  // // item.style.top = "20px";
  // // item.style.left= "20px";
  // // item.style.zIndex = 100;
  // // canvas.style.border = 'solid 2px blue';
  // // canvas.style.width = "100%";
  // // canvas.style.height = "600px";
  // return item;
}