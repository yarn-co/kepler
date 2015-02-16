/* 
*     
*  ========================================
*  Planet Finder!!!!
*  
*  This is a set of tools to process trixel viewers
*  and JSON data to build svgs via an offline process
*  
*  
*  
*  
*  
*/

var Kepler = (function(me) {
  return me;
}(Kepler || {}));


/*======================= 
  
    Simple ajax function
      
=======================*/ 


Kepler.getJSON = function(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
};

/*======================= 
  
    example


      Kepler.getJSON('http://api.trixel.io/trixels/65', function(data) {
      	// debugger
      	return data;
      }, function(status) {
        alert('Something went wrong.');
      });

      data.data.trixels

=======================*/ 


