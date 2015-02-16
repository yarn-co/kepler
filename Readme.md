```  
 a = new Kepler({
	width : 400,
	JSON_Data : JSONY,
	autoScale : true,
	display : true,
	dataType : 'JSON'
 })
 a = new Kepler({
	width : 400,
	JSON_Data : 'http://api.trixel.io/trixels/65',
	//JSON_Data : 'http://api.trixel.io/trixels/27',
	autoScale : true,
	display : true,
	dataType : 'AJAX'
 })

// static
 a.svgElement
// ajax
 Kepler.svgElement

```