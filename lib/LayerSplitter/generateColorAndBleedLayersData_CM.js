
var THREE = require('three/three.min.js');
var buildSunAndSpiralGrids_CM = require('./buildSunAndSpiralGrids_CM.js');
// var generateColorAndBleedLayersData_CM = require('./LayerSplitter/generateColorAndBleedLayersData_CM.js');
// var distanceTables = require('./LayerSplitter/distanceTables.js');


// var visualTools = require('./visualTools.js');

/*======================= 
  
    builds the layers as a bleed and paint
    
		The idea here is that we have a painting source layer and an outer layer
		that was generated to act as the Bleed layer

		This would get superceeded by a different routine if the high resolution work
		is too small and requires more layers

var MAINDATA = generateColorAndBleedLayersData(3)
=======================*/ 
/*
MAIN_Quads = generateColorAndBleedLayersData_CM(3)

MAIN_Quads.originalLayer[0]

MAIN_Quads.bleedLayer[0]

// red, white, blue
t1 = MAIN_Quads.originalLayer[0][1][0]
t2 = MAIN_Quads.originalLayer[0][1][1]
t3 = MAIN_Quads.originalLayer[0][1][2]
// var color = {r:Math.random()*1,g: Math.random()*1, b:Math.random()*1}
var color = {r:214/255, g:0/255, b:0/255}
t1.colorDirect(color,1)
Triforce.renderOnce()

var color = {r:255/255, g:255/255, b:255/255}
t2.colorDirect(color,1)
Triforce.renderOnce()

var color = {r:15/255, g:19/255, b:255/255}
t3.colorDirect(color,1)
Triforce.renderOnce()




// red, white, blue, green
t1 = MAIN_Quads.bleedLayer[0][1][0]
t2 = MAIN_Quads.bleedLayer[0][1][1]
t3 = MAIN_Quads.bleedLayer[0][1][2]
t4 = MAIN_Quads.bleedLayer[0][1][3]
var color = {r:214/255, g:0/255, b:0/255}
t1.colorDirect(color,1)
Triforce.renderOnce()

var color = {r:255/255, g:255/255, b:255/255}
t2.colorDirect(color,1)
Triforce.renderOnce()

var color = {r:15/255, g:19/255, b:255/255}
t3.colorDirect(color,1)
Triforce.renderOnce()

var color = {r:0/255, g:224/255, b:0/255}
t4.colorDirect(color,1)
Triforce.renderOnce()


*/







var generateColorAndBleedLayersData_CM = module.exports = function(layerNum, TrixelsDataTables_Z) {
	

	var orignalColorLayerNum = layerNum;
	var bleedLayerNum = orignalColorLayerNum + 1;


	var trixelUnit = 14;
	var gridPoint = new THREE.Vector3(0,0,0)
	// this wont work yet
	// it should not!!! its at center Zet
	// var gridPoint = Triforce.DNA.HitZonesWorld.parent.points[20]

	var start = new THREE.Vector3(0,0,24)
	
	// bleed layer
	var pinPoint = new THREE.Vector3(0, trixelUnit * bleedLayerNum, 24)
	// var stop = pinPoint

	// testing the offSet ring
	// var gridPoint = Triforce.DNA.HitZonesWorld.parent.points[400]
	// var pinPoint = new THREE.Vector3(gridPoint.x, trixelUnit*bleedLayerNum, 24)


	var splitGroupBleedLayer = buildSunAndSpiralGrids_CM(TrixelsDataTables_Z, bleedLayerNum, gridPoint, pinPoint);
	// splitGroupBleedLayer.originalLayer[0][0]


	// splitGroupBleedLayer.SunflowerGrid[0]
	// splitGroupBleedLayer.SunflowerGridAsQuads[0]
	// splitGroupBleedLayer.SunflowerGridAsQuads_Raw[0]
	// splitGroupBleedLayer.SpiralGrid[0]

	// do it again for the next layer!
	var pinPoint = new THREE.Vector3(0, trixelUnit * orignalColorLayerNum, 24)
	// var stop = pinPoint

	// testing the offSet ring
	// var gridPoint = Triforce.DNA.HitZonesWorld.parent.points[400]
	// var pinPoint = new THREE.Vector3(gridPoint.x, trixelUnit*orignalColorLayerNum, 24)


	var splitGroupOriginal = buildSunAndSpiralGrids_CM(TrixelsDataTables_Z, orignalColorLayerNum, gridPoint, pinPoint)


	// var line = lineCreate(start, stop)
	// Triforce.DNA.DA_UNIVERSE.scene.add( line );
	// Triforce.renderOnce()


	return {
		originalLayer : splitGroupOriginal.SunflowerGridAsQuads_Raw,
		bleedLayer : splitGroupBleedLayer.SunflowerGridAsQuads_Raw
	}
	



}