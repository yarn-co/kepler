

// var Document = require('html-document/lib/Document').Document;



/*======================= 
  
  the svg edges leave an edge effect, this tools merge and blur the geometries
  to do fake things to make it visually more pleasing, and print better

      
=======================*/ 


var Beautify = module.exports = {

  /*======================= 
    
      this returns a joined path of geometry for the passed parent element
      
  =======================*/ 
  
  mergePathsByColor : function(parent) {
      
      var paths = parent.getElementsByTagName('path') || [];
      
      var joinedPaths = {};
      var path, colorKey;
      for (var i = 0; i < paths.length; i++) {
        
        path = paths[i];
        colorKey = path.getAttribute('style');
        
        // Append paths based on color key.
        if (joinedPaths[colorKey]) {
              joinedPaths[colorKey].setAttribute('d', joinedPaths[colorKey].getAttribute('d') + ' ' + path.getAttribute('d'));
              path.parentNode.removeChild(path);
        } else {
              joinedPaths[colorKey] = path;
        }
      
      }
      
      return joinedPaths;
  },

  /*======================= 
    
      this creates a second svgElement to the inputed svgElement
      that has a blur filter to fill the gaps

      use svgElem.appendChild(groupElemGap);
      to append it where ever
        
  =======================*/ 
  
  fillGapsWithBlurEffect : function(document, svgElem) {
    
    // var document = new Document();

    // Make blurry filter
    var filter = document.createElement("filter");
    filter.setAttribute('id', 'f');
    
    var feBlur = document.createElement('feGaussianBlur');
    feBlur.setAttribute('stdDeviation', '.2');
    
    filter.appendChild(feBlur);
    
    svgElem.appendChild(filter);
    
    // Create blurry group to which we can apply the filter
    var groupElemGap = document.createElement("g");
    groupElemGap.setAttribute('filter', 'url(#f)');
    // svgElem.appendChild(groupElemGap);

    return groupElemGap;
  },


  /*======================= 
    
      this was in the createSVG file
      not sure its used at all but here it is
        
  =======================*/ 
  
  generateGradientBackground : function(document, svgElem, containerBoxWidth, containerBoxHeight, colors) {
    
  // Gradient background
  // does a pretty weak gradient
  // can be moved out
  // original_JSON_DATA.gradientBackground = true
    
    colors = colors || ['rgb(35,31,77)', 'rgb(8,64,81)'];
  
    var linearGradient = document.createElement('linearGradient');
    linearGradient.setAttribute('id', 'g');
    
    var stop1 = document.createElement('stop');
    stop1.setAttribute('offset', '0%');

    // gradientBackground: sharing ? ['rgb(35,31,77)', 'rgb(8,64,81)'] : false,

    stop1.setAttribute('style', 'stop-color:' + colors[0] + ';');
    // stop1.setAttribute('style', 'stop-color:' + original_JSON_DATA.gradientBackground[0] + ';');
    
    var stop2 = document.createElement('stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('style', 'stop-color:' + colors[1] + ';');
    // stop2.setAttribute('style', 'stop-color:' + original_JSON_DATA.gradientBackground[1] + ';');
    
    linearGradient.appendChild(stop1);
    linearGradient.appendChild(stop2);
    
    svgElem.appendChild(linearGradient);
    
    var bg = document.createElement('rect');
    bg.setAttribute('x', -containerBoxWidth/2);
    bg.setAttribute('y', -containerBoxHeight/2);
    bg.setAttribute('width', containerBoxWidth);
    bg.setAttribute('height', containerBoxHeight);
    bg.setAttribute('fill', 'url(#g)');
    
    // svgElem.appendChild(bg);
    return bg;

  }
  

}
