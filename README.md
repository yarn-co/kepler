# Kepler
Your premier planet-finder

## Usage
```javascript
var Kepler = require('kepler');

var options = {
    width: 400,             // Defaults to 300
    baseUnit: 20,           // Defaults to 14
    mergePaths: true        // Defaults to false, merges paths by color
    fillGaps: true,         // Defaults to false, adds small glow to each trixel to fill subpixel gaps
    gradientBackground: ['rgb(0,0,0)', 'rgb(255,255,255)'],  // Defaults false, adds two-color horizontal gradient as a background
    square: true,           // Defaults to false, displays image as a square crop instead of a tight crop
    padding: 5              // Defaults to 0, adds padding by percentage
}

var SVG = Kepler({/* trixel data from api */}, options);

/*
 * SVG.file holds the SVG file as a string
 * SVG.element holds a structured XML representation of the SVG
 */
```