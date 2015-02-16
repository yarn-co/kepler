
## To use


## Include files until this is minified
```
 <!-- Kepler!!!!! -->
  <script src="./Kepler.js?23894"></script>
  <script src="./AjaxSimple.js"></script>
  <script src="./Compile.js?38y4"></script>
  <script src="./WorldBuilder.js"></script>
  <script src="./WorldBuilderLoop.js"></script>
  <script src="./WorldBuilderMakerBot.js"></script>
  <script src="./copies_of_core/BuildSubdividePoints.js"></script>
  <script src="./copies_of_core/SunflowerLogic.js"></script>
  <script src="./copies_of_core/Sunflower_caches.js"></script>

```


### run either as a string or via AJAX, however AJAX here is just as an example test
### string expects ma_data.trixels[n]
### AJAX expects ma_data.data.trixels[n]

```  
// local json string

 a = new Kepler({
	width : 400,
	JSON_Data : JSONY,
	autoScale : true,
	display : true,
	dataType : 'JSON'
 })

 // very basic AJAX request for example only maybe

 a = new Kepler({
	width : 400,
	JSON_Data : 'http://api.trixel.io/trixels/65',
	//JSON_Data : 'http://api.trixel.io/trixels/27',
	autoScale : true,
	display : true,
	dataType : 'AJAX'
 })

// data output to get the returned svg

// local json var val
 a.svgElement
 and 
 Kepler.data.svgElement

// ajax request setter data
 Kepler.data.svgElement

```