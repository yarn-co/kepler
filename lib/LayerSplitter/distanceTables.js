
var trixelUtilites = require('./trixelUtilites.js');

/*======================= 
  
	these build out tables from given distances from a starting point
      
=======================*/ 

var distanceTables = module.exports = {

	/*======================= 
	  	
	    This builds a starter Table
			Its a bit different from generateDisTable()
			But its differences matter, so dont mix them up
			You will....

			Build a table of distances from a pointPoint
			We originally feed it an an ordered list of trixels from
			a splitLayer ring
	      
			var disTable = buildDistancesTable(Split_lllist, pinPoint);

			console.table(disTable);

	=======================*/ 



	buildStarterDistancesTable : function(trixelRingList, pinPoint) {
		
		var DISTable = [];

		var len = trixelRingList.length;
		for (var i = 0; i < len; i++) {

			var centroid = trixelRingList[i].centroid;
			var dis = centroid.distanceTo( pinPoint );
			
			// console.log(dis);
			DISTable.push({
				id:i,
				dis:dis
			})
		};

		return DISTable;
	},



	/*======================= 
	  
	    This builds a distance table from a list much like 
	    buildStarterDistancesTable but its to be used within the
	    walking inner outer loop for build the ring
	      
	=======================*/ 

	// generate disTable again
	// var disTableNew = generateDisTable(pickPoint.id, Split_lllist)
	generateDisTable : function(selectedId, trixelsList){

		var DISTable = [];
		// not bothering for a -1 here
		var selected = trixelUtilites.findTrixelFromId(selectedId, trixelsList);

		var len = trixelsList.length;
		for (var i = 0; i < len; i++) {
			var centroid = trixelsList[i].centroid;
			var dis = centroid.distanceTo( selected.centroid )
			// console.log(dis);
			DISTable.push({
				id: trixelsList[i].id,
				dis:dis
			})
		};

		return DISTable;
	},




	/*======================= 
	  
	    This sorts the disTable via mutation
	    near to far sorting
	    the first two are theoretically the same
	    so we retain the id which we'll go back to find the trixel
	    on the left
	    
	    console.table(disTable);
	     
	=======================*/ 

	sortDistancesTable : function( disTable ) {
		
		disTable.sort(function(a,b) {
			return a.dis - b.dis;
		});

		return disTable;
		
	},



/*======================= 
  
  pass a distanceTable and the trixels in a ring

  we want to find the start and stop point in the ring list
  we'll assign the left hand trixel the start

	we want the one with negative x
      
=======================*/ 

assignStartAndStopTrixels : function(disTable, trixelsList) {
	// debugger
	// console.log(trixelsList);
	var one = trixelsList[ disTable[0].id ].centroid;
	var two = trixelsList[ disTable[1].id ].centroid;
	var pickPoint, stopPoint, pickId;

	if (one.x < 0) {
		pickPoint = trixelsList[ disTable[0].id ]
		stopPoint = trixelsList[ disTable[1].id ]
		pickId = pickPoint.id
	}
	else {
		pickPoint = trixelsList[ disTable[1].id ]
		stopPoint = trixelsList[ disTable[0].id ]
		pickId = pickPoint.id
	}
	return {
		start : pickPoint,
		stop : stopPoint,
		id : pickId
	}
},




/*======================= 
  
    get the next id in the distance table
    this goes in a counterclockwise direction
    starting from top
      
=======================*/ 

findNextPointId_CM : function(currentId, previousId, DISTable) {
	// first sort the list

	// DISTable = disTableNew
	// sorting via the dis key
	// but retaining the indexes
	// have not tested scientific notation or small floats 
	
	// DISTable.sort(function(a,b) {
	// 	return a.dis - b.dis;
	// });
	// console.table(DISTable);
	this.sortDistancesTable(DISTable)

	// we just need the first 3
	// previous, next, current
	var smallList = [DISTable[0], DISTable[1], DISTable[2]]
	// console.table(smallList);
	var pickId = -1;
	// now pick!
	var len = 3;
	// debugger
	for (var i = 0; i < len; i++) {
		if (smallList[i].id !== currentId && smallList[i].id !== previousId ) {
			pickId = smallList[i].id
		};
	};

	return pickId;

},







}
