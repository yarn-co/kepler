

var zigZawLayer = require('./zigZawLayer.js');


/*======================= 
  	
	MAIN ROUTNE COMPOSITION!!!!!!
	NEWER VERSION

	The main issue here is that the ZigZaw was expecting 
	skdnfksndfkns ldfjsdfs


    More for the layers routine
      
=======================*/ 


// Triforce.forceRebuildViewer(5)

// Triforce.Tools.clearCanvasToRandom()

// Replacing this for the already prebuild form ring splitter data layers
// var MAIN_Quads = getQuadLayers_CM( 3, Triforce.DNA.SunflowerGridListInLayersAsMeshes )

// Remember the layers in TRIFORCE simulate the layer count as the bleed layer


/*

// normal use
var MAIN_Quads = generateColorAndBleedLayersData_CM(11)
performBleedLayerColoring_CM(MAIN_Quads.bleedLayer, MAIN_Quads.originalLayer)

	Triforce.renderOnce();

	var MAIN_Quads = generateColorAndBleedLayersData_CM(10)
	performBleedLayerColoring_CM(MAIN_Quads.bleedLayer, MAIN_Quads.originalLayer)



// tricky multi use
var __lev__ = 4
ORIGNAL_COLOR_LAYER = generateColorAndBleedLayersData_CM( __lev__ ).originalLayer

// lev 4
MAIN_Quads = generateColorAndBleedLayersData_CM( __lev__ )
performBleedLayerColoring_CM(MAIN_Quads.bleedLayer, MAIN_Quads.originalLayer)

Triforce.renderOnce();

// lev 5 + more
var __lev__ = 4
var len = 10
for (var i = 0; i < len; i++) {
	MAIN_Quads = generateColorAndBleedLayersData_CM( __lev__ + i )
	performBleedLayerColoring_CM(MAIN_Quads.bleedLayer, MAIN_Quads.originalLayer)
};

	Triforce.renderOnce();

*/


var performBleedLayerColoring_CM = module.exports = function(bleedLayer, originalLayer) {
	
	/*======================= 
	  
	    remove these
	      
	=======================*/ 
	
	// var MAIN_Quads = generateColorAndBleedLayersData_CM(11)
	// bleedLayer = MAIN_Quads.bleedLayer
	// originalLayer = MAIN_Quads.originalLayer
	// QUAD_INDEX = 0
	// PAIRS_INDEX = 0
	// // performBleedLayerColoring_CM(MAIN_Quads.bleedLayer, MAIN_Quads.originalLayer)







	// originalLayer
	// bleedLayer

	var QUAD_INDEX_len = 6;
	for (var QUAD_INDEX = 0; QUAD_INDEX < QUAD_INDEX_len; QUAD_INDEX++) {
		


			var Q_bleed_layer = bleedLayer[ QUAD_INDEX ];
			// feedTrixel(Q_bleed_layer[0])

			// getting the outer layer here, the one with the color to pick from
			var Original_layer = originalLayer[ QUAD_INDEX ][1];
			// feedTrixel(Orig_layer)

			var fillColor = null;
			var fillOpacity = null;
			var fillToggle = null;

			// Build the ZigZaws
			// We get the length of the Original_layer at the quad
			// and sample its color to produce pairs with a ZigZaw alternation
			// on the bleed layer and copy the color over, tada like!

			var len = Original_layer.length;
			for (var PAIRS_INDEX = 0; PAIRS_INDEX < len; PAIRS_INDEX++) {
					

					// Q 0
					// This needs an alternating thing
					// odd even?
					if (QUAD_INDEX === 0 || QUAD_INDEX === 2 || QUAD_INDEX === 4) {
						var Q_1 = zigZawLayer(Q_bleed_layer[0], Q_bleed_layer[1], "start");
						fillToggle = "start";
					}
					else {
						var Q_1 = zigZawLayer(Q_bleed_layer[0], Q_bleed_layer[1], "stop");
						fillToggle = "stop";
					}

					var pairList = Q_1.list;
					// debugger
					var Original_color = Original_layer[ PAIRS_INDEX ].material.color.clone();
					var Original_Opacity = Original_layer[ PAIRS_INDEX ].material.opacity;
					// feedTrixel(pairList)

					// perform colors in pairs
					var a1 = pairList[ PAIRS_INDEX * 2];
					var a2 = pairList[ (PAIRS_INDEX * 2) + 1];

					a1.material.color.copy(Original_color);
					a1.material.opacity = Original_Opacity;

					a2.material.color.copy(Original_color);
					a2.material.opacity = Original_Opacity;

					// Triforce.renderOnce();

					// store the first color and run a fill on it
					// only once properly
					if (fillColor === null && fillOpacity === null) {
						if (fillToggle === "start") {
							fillColor = Original_layer[ 0 ].material.color.clone();
							fillOpacity = Original_layer[ 0 ].material.opacity;
						}
						else {
							fillColor = Original_layer[ Original_layer.length-1 ].material.color.clone();
							fillOpacity = Original_layer[ Original_layer.length-1 ].material.opacity;
						}
						
						Q_1.pick.material.color.copy(fillColor);
						Q_1.pick.material.opacity = fillOpacity

					};

			};

	};


}