# Kepler
Your premier planet-finder

## Usage
```javascript
var Kepler = require('kepler');

var options = {
    width: 400,  // Defaults to 300
    baseUnit: 20 // Defaults to 14
}

var SVG = Kepler({/* trixel data from api */}, options);

/*
 * SVG.file holds the SVG file as a string
 * SVG.element holds a structured XML representation of the SVG
 */
```