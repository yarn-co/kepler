

/*======================= 
	
	Bleed layer

	Role:
	Given a Geometry we'll use the last two layers
	to perform 3 tasks.
	- get the second to last outer trixels layer colors at each quadrant
		record its colors
	- On the last layer we'll perform an interpreted "isometric" style of
		expanding colors from our previous sampling of colors, to make an extra
		layer of colors
	- Create a "cutting layer" sized magenta circle and place into the SVG data

	One major issue that may happen is the higher the resolution (smaller trixels)
	the higher the amount of textra layers that will need to be generated from the
	steps above. Synthesizer creates selected layers data via LayerSplitter, to be
	tested more.
	
	This expects that the Geometry will have layerSplit data. See LayerSplitter.
	
	Typical Recipe will be.
	Import JSON, add 1 layer to the Geometry building request

	Original implementation by Bill.
	Rewritten for pipelining.

      
=======================*/ 


var BleedLayer = module.exports = function (options) {

}

