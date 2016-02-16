
var _ = require('lodash');
var distanceTables = require('./distanceTables.js');
var trixelUtilites = require('./trixelUtilites.js');
var layerSplitter = require('./layerSplitter.js');
var mathTools = require('../mathTools.js');
/*======================= 
  	


	Ok so the idea here is that we need two things

	We have a layer splitter
	We need the trixels to test from

	then perform a stepping routine to divide the layer into 
	inner and outer trixeles
	HOWEVER we have one issue
	the corners have a double outer

	We can know when we reach through level + (level-1) counting
	



    test to get centroid(s) nearest origin point
    and then cascade through the points to get the points in
    a layers circle

    And then figure out which are the outer and inner

    AND then And then ehto~
      
=======================*/ 


// Triforce.forceRebuildViewer(24)

// Triforce.Tools.clearCanvasToRandom()



/*======================= 
  
    This builds out the Sunflower and Spiral grids
    Its a massive function broken up by utility functions
    but its mostly a one go thing so remains this huge
		
      
=======================*/ 
/*

var trixelUnit = 14, layer = 4;

var pinPoint = new THREE.Vector3(0, trixelUnit*layer, 24)

var gridPoint = new THREE.Vector3(0,0,0)

//var gridPoint = Triforce.DNA.HitZonesWorld.parent.points[400]
//var pinPoint = new THREE.Vector3(gridPoint.x, trixelUnit*layer, 24)

var stop = pinPoint
var start = new THREE.Vector3(0,0,24)

var line = visualTools.lineCreate(start, stop)
scene.add( line );


tonsOfGrids_L_4 = buildSunAndSpiralGrids_CM(layer, gridPoint, pinPoint)

tonsOfGrids_L_3 = buildSunAndSpiralGrids_CM(layer, gridPoint, pinPoint, true)


tonsOfGrids_L_4.SunflowerGridAsQuads_Raw

*/

// a simple for loop wont work cause you need to update the 
// first pinpoint, UNLESSSS we like make it reallllly high up?
// var len = 4
// for (var i = 2; i < len+2; i++) {
// 	pinpoint = THREE.Vector3(0, (trixelUnit*(i)), 24)
// 	buildSunAndSpiralGrids_CM(i, gridPoint, pinPoint)

// };


/*======================= 
  
    @layer = int
    @gridpoint 
    



    var trixelUnit = 14, layer = 4;

    var pinPoint = new THREE.Vector3(0, trixelUnit*layer, 24)

    var gridPoint = new THREE.Vector3(0,0,0)

    //var gridPoint = Triforce.DNA.HitZonesWorld.parent.points[400]
    //var pinPoint = new THREE.Vector3(gridPoint.x, trixelUnit*layer, 24)

    var stop = pinPoint
    var start = new THREE.Vector3(0,0,24)

    var line = visualTools.lineCreate(start, stop)
    scene.add( line );


=======================*/ 

// TrixelsDataTables_Z was renamed from Synthesizer_Z
var buildSunAndSpiralGrids_CM = module.exports = function(TrixelsDataTables_Z, layer, gridPoint, pinPoint, display) {

	/*
		var trixelUnit = 14, layer = 4;

		var pinPoint = new THREE.Vector3(0, trixelUnit*layer, 24)

		var gridPoint = new THREE.Vector3(0,0,0)

		//var gridPoint = Triforce.DNA.HitZonesWorld.parent.points[400]
		//var pinPoint = new THREE.Vector3(gridPoint.x, trixelUnit*layer, 24)

		var stop = pinPoint
		var start = new THREE.Vector3(0,0,24)

		var line = visualTools.lineCreate(start, stop)
		scene.add( line );

		var display = true

	*/


	var DATA = {
		SunflowerGrid : null,
		SunflowerGridAsQuads : null,
		SunflowerGridAsQuads_Raw : null,
		SpiralGrid : null

	}



	if (display) {
		// var stop = gridPoint
		// var start = new THREE.Vector3(0,0,24)
		// var line = lineCreate(start, stop)
		// Triforce.DNA.DA_UNIVERSE.scene.add( line );
		// Triforce.renderOnce()


	};





	/*======================= 
	  
	    First lets go for the trixels in layer splitter
	      
	=======================*/ 

	// this is not the exact same as Keplers but it shoudl be near enough
	// this one does not have an offset as that is not its job for now
	// var r = new layerSplitter(layer, gridPoint)

	// if we layer-1 here it works otherwise it fails
	// need to fix above?
	var r = new layerSplitter();
	r.build(layer,'r');
	r.ring.position.z = 24;
	if (display) {
		scene.add(r.ring);
	};



	r.ring.updateMatrix();

	// in Kepler this will need a list of trixels as they are not global
	// var p = r.getAll(TrixelsDataTables_Z.TRIXELS_DATA)
	TrixelsDataTables_Z.TRIXELS_DATA[0]
	TrixelsDataTables_Z.SPLIT_LIST = r.getAll(TrixelsDataTables_Z.TRIXELS_DATA)

	TrixelsDataTables_Z.SPLIT_LIST.length

	if (display) {
		 // debug display colors
		 var len = TrixelsDataTables_Z.SPLIT_LIST.length;
		 var color = Math.random()*0x9aff52
		 for (var i = 0; i < len; i++) {
		 	var t = TrixelsDataTables_Z.SPLIT_LIST[i].trixelMesh;
		 	t.material.color.setHex(0x9aff52)
		 	// t.material.color.setHex(color)
		 };
	}


	// console.table(p,["id"]);

	// need to map it now for better indexes
	// well we dont have that map yet, so we need
	// the trixels id or a UUID
	// but that needs to be sorted then
	// this was for Triforce
	TrixelsDataTables_Z.SPLIT_LIST.sort(function(a,b) {
		return a.id - b.id;
	});


	// length is 49 it should be 42
	// var len = TrixelsDataTables_Z.SPLIT_LIST.length;
	// for (var i = 0; i < len; i++) {
	// 	// console.log(p[i].id);
	// 	console.log(TrixelsDataTables_Z.SPLIT_LIST[i].id);
	// };

	// debugger
	// var len = u.length;
	// for (var i = 0; i < len; i++) {
	// 	// console.log(p[i].id);
	// 	console.log(u[i].id);
	// };




	// now only get the unique trixels from the list
	// we can use either the id or UUID
	var u = _.uniq(TrixelsDataTables_Z.SPLIT_LIST, function(item, key, a) { 
		// return item.id;
		return item.id;
	});
	TrixelsDataTables_Z.SPLIT_LIST = u;
	// debugger
	// p = u;

	// u.length === 42! 

	// now to test uniquesnes

	/*i = 0
	t=u[i]
	c ={r:49/255, g:255/255, b:82/255}
	t.colorDirect(c,1)
	Triforce.renderOnce()
	i++
	for (var i = 0; i < len; i++) {
		// console.log(p[i].id);
		console.log(p[i].UUID);
	};
	*/








	// test another display
	// which shows they are not in order
	// which is what we want and dont want
	if (display) {

		var len = TrixelsDataTables_Z.SPLIT_LIST.length
		for (var i = 0; i < len; i++) {
			var l = visualTools.realTimeLerpy(i,len);
			// we dont have this in kepler
			// p[i].setAlphaZeroOne(l);
			TrixelsDataTables_Z.SPLIT_LIST[i].trixelMesh.material.transparent = true
			TrixelsDataTables_Z.SPLIT_LIST[i].trixelMesh.material.opacity = l;

		};

	};




	/*======================= 
	  
	    now well step through them to make the fake sunflower list
	    and it seems simultaneously the spiral
	      
	=======================*/ 
	/*
	i = 0

	t=p[i]

	t=p[18]
	c ={r:249/255, g:255/255, b:82/255}
	t.colorDirect(c,1)
	Triforce.renderOnce()

	i++
	*/

	// we skiped the original 
	// startingTrixelPoint = t.center()

	// we are skipping the circle height check
	// y= 49




	// we need to map ids to the trixels, This step was not in kelpers version
	// this is to match the data tables in Keplers layout
	// var Split_lllist = []

	// recompute these reguardless of where else they were or ere not created from
	// might require a matrixUpdate
	// TrixelsDataTables_Z.computeCentroids()
	mathTools.computeCentroidsFromMesh(TrixelsDataTables_Z.TRIXELS_DATA);

	// TrixelsDataTables_Z.SPLIT_LIST[0].centroid

	// this is annoying so turnign the debug off
	/*
	if (debug) {
		var len = TrixelsDataTables_Z.TRIXELS_DATA.length;
		for (var i = 0; i < len; i++) {
			TrixelsDataTables_Z.TRIXELS_DATA[i].centroidMesh = visualTools.drawDisplayCircleSingle(
				TrixelsDataTables_Z.TRIXELS_DATA[i].centroid, 1,'r');
		};
	};
	*/


	var starterDisTable = distanceTables.buildStarterDistancesTable(TrixelsDataTables_Z.SPLIT_LIST, pinPoint);
	// console.table(starterDisTable); 

	distanceTables.sortDistancesTable(starterDisTable)
	// console.table(starterDisTable);



	// so in theroy we can now ask [0], [1]
	// SUCESS!!!
	// The example here SHOULD MUST show that
	// one of these is on the top left and one is on the top right
	// OTHER WISE THIS ALL FAILS!!!!!! Fun!
	// one = Split_lllist[ starterDisTable[0].id ].trixel
	// // rgba(255, 117, 129, 1)
	// c ={r:249/255, g:117/255, b:129/255}
	// one.colorDirect(c,1)
	// Triforce.renderOnce()

	// two = Split_lllist[ starterDisTable[1].id ].trixel
	// // rgba(117, 255, 163, 1)
	// c ={r:117/255, g:117/255, b:163/255}
	// two.colorDirect(c,1)
	// Triforce.renderOnce()


	var startAndStopTrixels = distanceTables.assignStartAndStopTrixels(starterDisTable, 
		TrixelsDataTables_Z.SPLIT_LIST);

	var stopPoint = startAndStopTrixels.stop;

	/*
	one = startAndStopTrixels.start.trixel
	// rgba(216, 255, 117, 1)
	c ={r:216/255, g:255/255, b:117/255}
	// c ={r:255/255, g:117/255, b:232/255}
	one.colorDirect(c,1)
	Triforce.renderOnce()
	*/

	/*
	think these need to be set , not sure just yet
	pickedMesh = pickPoint.centroidMesh
	pickedMesh.material.color.setHex( Math.random()*0xffffff )

	stopMesh = stopPoint.centroidMesh
	stopMesh.material.color.setHex( Math.random()*0xffffff )
	*/



	/*======================= 
	  
		
		AND NOW do a recursive loop to get next next next ... stop
	    
	      
	=======================*/ 



	// make a list of ids and rebuild the order?

	var walkingPoint = startAndStopTrixels.start.centroid.clone();


	// first lets update the line indicator
	// line.geometry.verticesNeedUpdate = true
	// line.geometry.vertices[1].copy(walkingPoint)
	// Triforce.renderOnce()


	var selectedPoint = trixelUtilites.findTrixelFromId(startAndStopTrixels.start.id, 
		TrixelsDataTables_Z.SPLIT_LIST);

	// var disTableNew = generateDisTable(selectedPoint.id, Split_lllist)

	// console.table(disTableNew);

	// sortDistancesTable(disTableNew)
	// console.table(disTableNew);






	/*======================= 
	  
	    
	      
	=======================*/ 



	// start 12
	// stop 23
	if (display) {

		var trixel = trixelUtilites.findTrixelFromId(selectedPoint.id, TrixelsDataTables_Z.SPLIT_LIST)
		line.geometry.verticesNeedUpdate = true
		line.geometry.vertices[1].copy( trixel.centroid )

	};

	// now to build up the sorting in two arrays
	// the previous, current, next
	var train = [null, null]
	var path = []

	// starter
	train[0] = stopPoint.id
	train[1] = selectedPoint.id


	// console.table(Split_lllist, ["id"]);

	// loop
	var len = TrixelsDataTables_Z.SPLIT_LIST.length;
	for (var i = 0; i < len; i++) {

		// i = 0

		var disTableNew = distanceTables.generateDisTable(train[1], TrixelsDataTables_Z.SPLIT_LIST)
		// console.table(disTableNew);
		// sortDistancesTable(disTableNew)
		nextId = distanceTables.findNextPointId_CM(train[1], train[0], disTableNew)
		if (nextId !== -1) {


			path.push(train[1])
			
			if (display) {

				// debug display the walking point
				var trixel = trixelUtilites.findTrixelFromId(nextId, TrixelsDataTables_Z.SPLIT_LIST)

				// trixel.centroidMesh.material.color.setHex( Math.random()*0xffffff )
				
				line.geometry.verticesNeedUpdate = true
				line.geometry.vertices[1].copy( trixel.centroid )

			};
			// now update the train
			train.shift()
			train.push(nextId)

		};

	};


	// at level 4 length should be 42
	path.length

	// Build the trixel list as spiral
	// test the order of colors as spiral
	var Spiral_Path = []

	if (display) {

		var len = path.length
		for (var i = 0; i < len; i++) {
			var t = trixelUtilites.findTrixelFromId(path[i], TrixelsDataTables_Z.SPLIT_LIST)
			var l = visualTools.realTimeLerpy(i,len);
			
			t.trixelMesh.material.transparent = true
			t.trixelMesh.material.opacity = l;

			Spiral_Path.push(t)

		};

	} else{
		var len = path.length
		for (var i = 0; i < len; i++) {
			var t = trixelUtilites.findTrixelFromId(path[i], TrixelsDataTables_Z.SPLIT_LIST)
			Spiral_Path.push(t)
		};

	}

	// So now we take the level as even odd of the 
	// level + (level+1)
	// and simply say each other is the outer inner
	// starting with outer dues to the original starter

	function isOdd(num){ return num % 2 }

	var limit = layer + (layer - 1)

	// just testing the ids in an array
	// var sIds = []
	// var len = Spiral_Path.length;
	// for (var i = 0; i < len; i++) {
	// 	sIds.push(Spiral_Path[i].id)
	// };




	// at level 4 this should be lengths
	// [ [18], [24] ]
	// while we are building this we can simply get the quads as well
	// and skip a step!

	// We dont need the index map id now
	// could sumch this down to just trixels
	// eh but theres other data so keep it

	var SunflowerGrid_remux = [[],[]]
	var SunflowerGrid_remuxAs_Quads = [];

	// Arrgs this name. Anyway its the array with trixels only
	var SunflowerGridAsQuads_Raw = [];

	var limit = layer + (layer - 1)

	var len = 6
	for (var i = 0; i < len; i++) {
		var Quad = [];
		var inner = [];
		var outer = [];

		var rawInner = [], rawOuter = [], rawQuad = [];

		// var getSlice = sIds.slice(limit*i,(limit*i)+limit);
		var getSlice = Spiral_Path.slice(limit*i,(limit*i)+limit);
		// debugger
		// console.log(a);

		var len2 = getSlice.length;
		for (var g = 0; g < len2; g++) {

			var t = getSlice[g];
			var rawTrixel = getSlice[g].trixelMesh;

			if (isOdd(g) === 0) {
				SunflowerGrid_remux[1].push(t)
				outer.push(t);
				rawOuter.push(rawTrixel);
			}
			else{
				SunflowerGrid_remux[0].push(t)
				inner.push(t);
				rawInner.push(rawTrixel);
			}

		};

		Quad.push(inner,outer);
		rawQuad.push(rawInner, rawOuter);
		SunflowerGrid_remuxAs_Quads.push(Quad)
		SunflowerGridAsQuads_Raw.push(rawQuad)
	};


	// no this one wont do. We need slices instead

	/*
	var SunflowerGrid_remux = [[],[]]
	var SunflowerGrid_remuxAs_Quads = []

	spiralOutOfControl( SunflowerGrid_remuxAs_Quads[0] )
	Triforce.renderOnce()

	feedTrixel()
	*/
	// SunflowerGrid_remux
	// ARrrrggg more color testing
	if (display) {

		var len = SunflowerGrid_remux[0].length;
		var color = {r:Math.random()*1,g: Math.random()*1, b:Math.random()*1}
		for (var i = 0; i < len; i++) {
			// trixels[i].colorDirect(color,1)
			var t = SunflowerGrid_remux[0][i].trixelMesh
			t.material.color.setRGB(color.r, color.g, color.b)
			
		};

	};


	DATA.SunflowerGrid = SunflowerGrid_remux;

	DATA.SunflowerGridAsQuads = SunflowerGrid_remuxAs_Quads;

	DATA.SpiralGrid = Spiral_Path;

	DATA.SunflowerGridAsQuads_Raw = SunflowerGridAsQuads_Raw;

	// TrixelsDataTables_Z.DATA = DATA;

	return DATA;

	/*
	// ARrrrggg more color testing
	var len = SunflowerGrid_remux[1].length;
	var color = {r:Math.random()*1,g: Math.random()*1, b:Math.random()*1}
	for (var i = 0; i < len; i++) {
		// trixels[i].colorDirect(color,1)
		var t = SunflowerGrid_remux[1][i].trixel
		t.colorDirect(color,1)
	};
	Triforce.renderOnce()




	// ARrrrggg more color testing
	var len = SunflowerGrid_remuxAs_Quads[1][0].length;
	var color = {r:Math.random()*1,g: Math.random()*1, b:Math.random()*1}
	for (var i = 0; i < len; i++) {
		// trixels[i].colorDirect(color,1)
		var t = SunflowerGrid_remuxAs_Quads[1][0][i].trixel
		t.colorDirect(color,1)
	};
	Triforce.renderOnce()

	var len = SunflowerGrid_remuxAs_Quads[1][1].length;
	var color = {r:Math.random()*1,g: Math.random()*1, b:Math.random()*1}
	for (var i = 0; i < len; i++) {
		// trixels[i].colorDirect(color,1)
		var t = SunflowerGrid_remuxAs_Quads[1][1][i].trixel
		t.colorDirect(color,1)
	};
	Triforce.renderOnce()

	*/

}