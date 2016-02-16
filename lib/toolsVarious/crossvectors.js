

/*======================= 
  
    This is a direct copy from Triforce
    DONT CHANGE it
      
=======================*/ 

var getCrossingVectors = module.exports = {


  // Triforce.PaintingEngine.RaycasterIn2D.crossingVectors = function(poly, vector, ifDebug) {
  crossingVectors : function(poly, vector, ifDebug) {
      var intersections = 0;
      var index = 0;

      // in case trixel has 3 vertices we need a repeat to the first
      if (poly.length === 3) {
          var v = poly[0];
          poly.push(v);
      };

      for (side = 0; side < poly.length-1; side++) {
          // areWeIntersecting(0,8,20,8,18,0,14,20)
          // Test if current side intersects with ray.
          // debugger
          var test = this.areWeIntersecting(
            vector[0].x,
            vector[0].y,
            vector[1].x,vector[1].y,
              // poly[index].x,poly[index].y,poly[index+1].x,poly[index+1].y)
              poly[side].x,
              poly[side].y,
              poly[side+1].x,
              poly[side+1].y)

          // If yes, intersections++;
          if ( test === 1 ){
              intersections++;
          }

      }
      if (intersections === 1) {

          if (ifDebug) {
            // If we have one crossed it mean we are inside trixel!
            console.log("Inside trixel!");
          };

          return 1;

      }
      else if (intersections === 2) {// changed to 2 from 1 cause checking on two edges
          if (ifDebug) {
            console.log("Selected Trixel!!! Since have two edges");
          }

          return 2;

      } else {
          if (ifDebug) {
            console.log("outside like of polygon");
          }

          return 3;

      }
      if (ifDebug) {
        console.log(intersections);
      }
  },

  /* 
  *     
  *    test against the edges to see if they cross
  *    its testing two vectors making an X
  *       
  */
  areWeIntersecting : function(  v1x1,  v1y1,  v1x2,  v1y2, v2x1,  v2y1,  v2x2,  v2y2, ifDebug ) {
      var NO = 0;
      var YES = 1;
      var COLLINEAR = 2;

      var d1, d2, a1, a2, b1, b2, c1, c2;

      // Convert vector 1 to a line (line 1) of infinite length.
      // We want the line in linear equation standard form: A*x + B*y + C = 0
      // See: http://en.wikipedia.org/wiki/Linear_equation
      a1 = v1y2 - v1y1;
      b1 = v1x1 - v1x2;
      c1 = (v1x2 * v1y1) - (v1x1 * v1y2);

      // Every point (x,y), that solves the equation above, is on the line,
      // every point that does not solve it, is either above or below the line.
      // We insert (x1,y1) and (x2,y2) of vector 2 into the equation above.
      d1 = (a1 * v2x1) + (b1 * v2y1) + c1;
      d2 = (a1 * v2x2) + (b1 * v2y2) + c1;

      // If d1 and d2 both have the same sign, they are both on the same side of
      // our line 1 and in that case no intersection is possible. Careful, 0 is
      // a special case, that's why we don't test ">=" and "<=", but "<" and ">".
      if (d1 > 0 && d2 > 0){
        if (ifDebug) {
          console.log("no1");
        }
          return NO;
      }
      if (d1 < 0 && d2 < 0){
        if (ifDebug) {
          console.log("no2");
        }
          return NO;
      }

      // We repeat everything above for vector 2.
      // We start by calculating line 2 in linear equation standard form.
      a2 = v2y2 - v2y1;
      b2 = v2x1 - v2x2;
      c2 = (v2x2 * v2y1) - (v2x1 * v2y2);

      // Calulate d1 and d2 again, this time using points of vector 1
      d1 = (a2 * v1x1) + (b2 * v1y1) + c2;
      d2 = (a2 * v1x2) + (b2 * v1y2) + c2;

      // Again, if both have the same sign (and neither one is 0),
      // no intersection is possible.
      if (d1 > 0 && d2 > 0){
        if (ifDebug) {
          console.log("no3");
        }
          return NO;
      }
      if (d1 < 0 && d2 < 0){
        if (ifDebug) {
          console.log("no4");
        }
          return NO;
      }

      // If we get here, only three possibilities are left. Either the two
      // vectors intersect in exactly one point or they are collinear
      // (they both lie both on the same infinite line), in which case they
      // may intersect in an infinite number of points or not at all.
      if ( (a1 * b2) - (a2 * b1) === 0.0){
        if (ifDebug) {
          console.log("COLLINEAR");
        }
          return COLLINEAR;
      };

      // If they are not collinear, they must intersect in exactly one point.
      if (ifDebug) {
        console.log("Tacos! Crossing vectors!");
      }
      return YES;
  }


}

