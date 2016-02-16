

var Document = require('html-document/lib/Document').Document;
var Beautify = require('./Beautify.js');
var KeplerHeader = require('./KeplerHTTPHeader');

var mathTools = require('./mathTools.js');

/*======================= 
  
    createSVG
  
=======================*/ 
var createSVG = module.exports = function (Geometry, original_JSON_DATA, amountOfLayers) {

      original_JSON_DATA.fillGaps = true
      original_JSON_DATA.mergePaths = true
      
      // If filling gaps, clone paths into the blurry group

      // Our fake HTML document
      var document = new Document();
      
      
      var width = original_JSON_DATA.width;
      // the count changes in Synthesizer 
      var layersCount = amountOfLayers || original_JSON_DATA.amountOfLayers;
      var BASE_UNIT = original_JSON_DATA.baseUnit;

      // We need the nearest width at the start
      // This is just the width of the trixel itself

      var boxWidth = width;
      var boxHeight = mathTools.calcFullHeight(width, layersCount, BASE_UNIT);
      
      var containerBoxWidth;
      var containerBoxHeight;
      
      containerBoxWidth = boxWidth;
      containerBoxHeight = boxHeight;
      
      if (original_JSON_DATA.square) {
        containerBoxWidth = containerBoxHeight;
      }
      
      if (original_JSON_DATA.padding) {
        containerBoxWidth  *= 1+(2*original_JSON_DATA.padding/100);
        containerBoxHeight *= 1+(2*original_JSON_DATA.padding/100);
      }
      
      var svgElem = document.createElement("svg");

      // Size/view
      svgElem.setAttribute("viewBox", -containerBoxWidth/2 + " " + -containerBoxHeight/2 + " " + containerBoxWidth + " " + containerBoxHeight);

      // SVG infos
      svgElem.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svgElem.setAttribute("version", "1.1");
      
      // No background default
      svgElem.setAttribute("style", 'background-color: rgba(0, 0, 0, 0);');
      

      // // Filter, etc to fill gaps between trixels
      // moved below after geometry generation so we can refactor it out of the file
      // if (original_JSON_DATA.fillGaps) {
      //   var groupElemGap = Beautify.fillGapsWithBlurEffect(document, svgElem);
      //   svgElem.appendChild(groupElemGap);
      // }
      
      // Add group for main trixel pieces
      var groupElem = document.createElement("g");
      svgElem.appendChild(groupElem);  
      
      // original height / calculated height of all trixels in a row top to bottom
      // var unitScale = unit || boxHeight / ( Triforce.trixelUnit * ( (Triforce.DNA.amountOfLayers - 1) * 2) );
      var unitScale = mathTools.calcUnitScale(boxWidth, layersCount, BASE_UNIT);
      var styles;
      var opacity;
      var path;
      

      /*======================= 
        
        Geometry.allTrixelsAsMeshes[i].geometry.vertices
            
      =======================*/ 
      

      Geometry.allTrixelsAsMeshes.forEach(function(obj, key) {
      
        styles = '';
        path  = document.createElement("path");
        
        // Theres an issue with Y being flipped, maybe to do with viewBox so * -1 seems to work fancy like!
        // Create one trixel
        var verts = obj.geometry.vertices;
        path.setAttribute('d', 'M ' + verts[0].x * unitScale + ' '+ (verts[0].y * unitScale)*-1 +'  L ' + verts[1].x * unitScale + ' '+ (verts[1].y * unitScale)*-1 +' L ' + verts[2].x * unitScale + ' '+ (verts[2].y * unitScale)*-1 +'z');

        var color = obj.material.color.getStyle();
        // console.log("color", color);
        styles += 'fill:'+color+';';
        // default is 1 so this is fine
        styles += 'fill-opacity:'+obj.material.opacity+';';
        path.setAttribute('style',  styles);
        
        groupElem.appendChild(path);
        
      }); // end forEach
      
      
      /*======================= 
        
          these below are Beautify additions
          they can be moved out 
            
      =======================*/ 
      

      // Filter, etc to fill gaps between trixels
      // this was moved from above
      // so it can be tested and moved out of this file
      if (original_JSON_DATA.fillGaps) {
        var groupElemGap = Beautify.fillGapsWithBlurEffect(document, svgElem);
        // svgElem.appendChild(groupElemGap);
        svgElem.insertBefore(groupElemGap, svgElem.childNodes[0]);
      }
      

      if (original_JSON_DATA.mergePaths) {
          var joinedPaths = Beautify.mergePathsByColor(groupElem);
      }
      
      // If filling gaps, clone paths into the blurry group
      if (original_JSON_DATA.fillGaps) {
        var childPath;
        var tmpPath;
        for (var i = 0; i < groupElem.children.length; i++) {
              
              childPath = groupElem.children[i];
              tmpPath = document.createElement('path');
              
              tmpPath.setAttribute('d', childPath.getAttribute('d'));
              tmpPath.setAttribute('style', childPath.getAttribute('style'));
              
              groupElemGap.appendChild(tmpPath);
        }
      }


      // Moving gradient out to Beautify
      original_JSON_DATA.gradientBackground = true
      if (original_JSON_DATA.gradientBackground) {
        var colors = ['rgb(255,121,12)', 'rgb(55,42,100)'];
        var bg = Beautify.generateGradientBackground(document, svgElem, 
          containerBoxWidth, containerBoxHeight, colors);

        // svgElem.appendChild(bg);
        svgElem.insertBefore(bg, svgElem.childNodes[0]);
        
      }
      



      /*======================= 
        
          move print line out
            
      =======================*/ 
      
      // We need to move the print line into a global layer group to
      // allow the printer to remove the line easily
      // todo
      //var printerCutLineGroup = document.createElement("g");
      

      // This can be moved out
      // if(original_JSON_DATA.bleedLayer) {
        var printerCutline = document.createElement("polygon");
        printerCutline.setAttribute("style", "fill:none;stroke:#FF00FF;stroke-width:1");
        
        
        

        var V_ = Geometry.cutCircle.geometry.vertices;
        var p0 = V_[0].x*unitScale + "," + V_[0].y*unitScale;
        var p1= V_[1].x*unitScale + "," + V_[1].y*unitScale;
        var p2= V_[2].x*unitScale + "," + V_[2].y*unitScale;
        var p3= V_[3].x*unitScale + "," + V_[3].y*unitScale;
        var p4= V_[4].x*unitScale + "," + V_[4].y*unitScale;
        var p5= V_[5].x*unitScale + "," + V_[5].y*unitScale;
        var p6= V_[6].x*unitScale + "," + V_[6].y*unitScale;

        var cutlinePoints = p0 + ' ' + p1 + ' ' + p2 + ' ' + p3 + ' ' + p4 + ' ' + p5 + ' ' + p6;

        // console.warn("cutlinePoints", cutlinePoints);

        printerCutline.setAttribute("points", cutlinePoints);
        svgElem.appendChild(printerCutline);
      // }



      // this was from Quantum
      // SVG_Object.file = KeplerHeader + SVG_Object.element.outerHTML;
      
      // Grab Kepler header from require
      var file = KeplerHeader + svgElem.outerHTML;
      
      return {
        element: svgElem,
        file: file
      };

}
