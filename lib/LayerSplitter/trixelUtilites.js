

/*======================= 
  
    various functions
      
=======================*/ 


var trixelUtilites = module.exports = {



	/*======================= 
	  
	  simply returns a lookup on the trixels list for the index id
		findTrixelFromId(0,Split_lllist)
	      
	=======================*/ 


	findTrixelFromId : function(id, trixelsList) {
		var len = trixelsList.length;
		for (var i = 0; i < len; i++) {
			if (trixelsList[i].id === id) {
				return trixelsList[i];
			};
		};
		return -1;
	},

	

}