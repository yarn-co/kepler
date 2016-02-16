

/*======================= 
  
    Path of the Beautify routine
    >>> Refactor into pipeline
      
=======================*/ 

internals.mergePathsByColor = function(parent) {
    
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
    
};
