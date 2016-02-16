/*======================= 

  folding and splicing function
	
	given a set of two trixel arrays
	for inner outer, we'll fold them together
	in a zigzaw pattern. But we will have a tag along
	that needs to match it's neighbor color
	due to the isometric pattern for the bleed layer

	The ide here though is that we create an even pair of trixels
	we can easily iterate against pairs


	Quadrant 0
	O	-[0],    1, 2, 3, 4
	I					0, 1, 2, 3

	Quadrant 1
	O	0, 1, 2, 3,   -[4]
	I	  0, 1, 2, 3
	
	Q 2 follows Q 0,
	Q 3 follows Q 1,
	Q 4 follows Q 0,
	Q 5 follows Q 1,


	Always returns an even length as its pairs

	// start example
	["0"] 	"1"  "2" "3" "4"
					0   1    2   3
	// stop example
	"0" "1" "2" "3" 		["4"]
		 0   1   2   3

	We do this 6 times, but the order alternates
	Could we square these into one?
	The formula for the alternation would still be needed to declare
	quadrant
	Each levels quadrant will have Level+1 trixels.
	So L2 = 3
	So QIndex = 0; QIndex++
	if (QIndex === limit ) QIndex = 0




	qO = ["0","1","2","3","4"]
	qI = [0,1,2,3]

	var foldedList = [];

	var pickWhere = "stop";
	var pickWhere = "start";

	var len = qI.length;


	var pickOffIndex = 1;
	// start pick
	var pickStart = qO[0];
	// stop pick
	var pickStop = qO[qO.length-1];


	// testing for start
	foldedList = []
	for (var i = 0; i < len; i++) {
			foldedList.push(
				qI[i],
				qO[i+pickOffIndex]
			);
	};

	foldedList

	// testing for stop
	foldedList = []
	pickOffIndex = 0
	for (var i = 0; i < len; i++) {
			foldedList.push(
				qO[i+pickOffIndex],
				qI[i]
			);
	};

	foldedList




=======================*/ 


/*======================= 
  
	zigZawLayer:
	Make a merged list of inner and outer trixels

	@pickIndexFrom either "start" or "stop"
	
	qO = ["0","1","2","3","4"]
	qI = [0,1,2,3]
	

	// Start example we want a 0 for start
	// Start: 0 Stop: 4 [0, "1", 1, "2", 2, "3", 3, "4"] 0
	var t = zigZawLayer(qI, qO, "start")
	console.log("Start:", t.pickStart, "Stop:", t.pickStop, t.list, t.pick);

	// Stop example, we want a 4 for stop
	// Start: 0 Stop: 4 ["0", 0, "1", 1, "2", 2, "3", 3] 4
	var t = zigZawLayer(qI, qO, "stop")
	console.log("Start:", t.pickStart, "Stop:", t.pickStop, t.list, t.pick);
 

=======================*/ 



var zigZawLayer = module.exports = function( innerTrixels, outerTrixels, pickIndexFrom) {
	
	var foldedList = [];

	var len = innerTrixels.length;

	var pickStart = outerTrixels[0];

	var pickStop = outerTrixels[outerTrixels.length-1];

	var pickedFromIndex;

	var pickOffIndex = 1;

	if (pickIndexFrom === "start") {
		
		for (var i = 0; i < len; i++) {
				foldedList.push(
					innerTrixels[i],
					outerTrixels[i+pickOffIndex]
				);
		};
		pickedFromIndex = pickStart;

	}
	else {

		for (var i = 0; i < len; i++) {
				foldedList.push(
					outerTrixels[i], 
					innerTrixels[i]
					);
		};
		pickedFromIndex = pickStop;
	}

	return {
		list : foldedList,
		pickStart : pickStart,
		pickStop : pickStop,
		pick : pickedFromIndex
	}

}



