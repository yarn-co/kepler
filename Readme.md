
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

```
node
Kepler = require('./Kepler.js')
JSONY = require('./temp_files/tempjson.js')
SpaceSVG = Kepler({ JSON_Data : JSONY, autoScale : false, display : false, dataType : 'JSON'})
SpaceSVG.entireFileOutPut

```