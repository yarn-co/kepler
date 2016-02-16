

Requires THREE.js

Synthesizer:
This will take a Kepler World Geometry that has new Pan and Zoom data 
and perform routines to spit out a smaller Geometry of the saved Pan and zoom
locations masking to be used as is or to combine with
the sticker sheet and quantum cards or whatever else

This should stay a pipleline item

Pattern

of one call to API
we get JSON data
the server handles the request and creates a Kepler geometry object
	which is a Geometry object
From there we will pass this Geometry to various pipes
But for our Synthesizer we'll focus on just the good parts here

IF Debug show various stages
Otherwise just get data tables

- Build a barrier the size of the zoomIndex
		position barrier the the gridindex 
- Perform a trixels in barrier routine
- Build a new Geometry fro the found trixels table
- Move the matrix of the geometry to recenter the new trixels
- Rebuild centroids
- Build layersplitter
		find the outer most layer and save as data
- From the new found layer do path routine to get order of
		trixels in counter clockwise array
- With new path order data save for stickersheet



