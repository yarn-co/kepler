
/*======================= 
  
    
    to make this backward compliant to the current trixel-svg api app
    a few recipes will be built to handle these toggles below
    as we dont want to couple the toggles into the source code
    that is BAD form.

    options.stickerSheet etc examples

    bleedLayer count < if > 0 its true
    padding true
    cutline true
    stickerSheet Mode

    quantumCardPass

    beautifyPass

    output PDF | SVG

    
    modes vs passes
    
    Modes: 
    single
    stickerSheet
  
    Right now we have duplicated the modes code pretty much in full.
    Todo refactor to the clean step of pipes
    aka more nested CM functions
    

      
=======================*/ 

var WorldBuilder = require('./WorldBuilder');

var Stickersheet = require('./Stickersheet');

// these can be removed once refactored to recipes
var KeplerHeader = require('./KeplerHTTPHeader');
var Synthesizer = require('./Synthesizer/Synthesizer.js');
var QuantumCardGenerator = require('./QuantumCardGenerator.js');
var SynthesizerRoutine_CM = require('./Synthesizer/SynthesizerRoutine_CM.js');
var visualTools = require('./Synthesizer/visualTools.js');
var BleedLayerRoutine_CM = require('./BleedLayer/BleedLayerRoutine_CM.js');
var createSVG = require('./createSVG.js');

// var fs = require('fs');



// Options is a bad name here now, needs options and data
var Compile = module.exports = function (options) {



  // auto handle the modes from the current expected API's requests
  if (options.stickerSheet) {
    return Mode_StickerSheet(options);
  }
  else{
    return Mode_Single(options);
  }
  // return Mode_Single(options);

  /*======================= 
    
      a temporary solution to dealing with the rewrite and reorganizing
      to retain Compile as the go to function
        
  =======================*/ 
  

  /*======================= 
    
      Stickersheet expects
      bleedLayer +1
      padding
      grid
      beautify
      returning the crazy large SVG
      only one trixel API painting for now

  =======================*/ 
  
  function Mode_StickerSheet(options) {
      
      // var width = options.width;
      // var jsonData = options.trixels;

      // var BASE_UNIT = options.baseUnit;


      /*======================= 
        
          >>> Bleedlayer, refactor this into new file
            
      =======================*/ 

      // var BLEEDLAYER_More = 0;
      // bleedlayer has been wired to create multiple layers
      // not sure its a strategy to use but its available
      // but for now we will just assign +1
      // if(options.bleedLayer > 0) {
      // if(options.bleedLayer) {
      //   // options.layers += 1; // +1 for iso-bleed! this should just be +1
      // }
      var BLEEDLAYER_More = 1;

      var layersCount = options.layers + BLEEDLAYER_More; // the default 
      var originalZoomIndex = options.zoomIndex + BLEEDLAYER_More; // the default 

      // here we could do a match if ZoomIndex === amountOfLayers and GridIndex === 0
      // to bypass the synthesizer step but since its crucial that both work
      // it might as well rely of Synth to work
      // so we'll leave it be for now unless we need to optimize speed


      var MAIN_DATA = {
        Geometry : null,
        trixelCount : null,
        layersCount : layersCount,
        originalTrixels : options.trixels,
        zoomIndex : layersCount, // the default is full screen, later things can adjust this
        gridIndex : options.gridIndex
      }

      // FROM HERE ON OUT dont access options.trixels.length
      // or options.layers



      MAIN_DATA.Geometry = WorldBuilder.init( 
        MAIN_DATA.layersCount, 
        options.baseUnit, 
        MAIN_DATA.originalTrixels
      );
      MAIN_DATA.trixelCount =  MAIN_DATA.Geometry.allTrixelsAsMeshes.length;

      /*======================= ======================= ======================= 
        
          Begin test adding module routines until it works

          Snyth would happen before the Bleed layer
          HOWEVER Bleed affects the inital layers count
          Sigh......
            
      ======================= ======================= ======================= */ 





      /*======================= ======================= ======================= 
        
          Synth
            
      ======================= ======================= ======================= */ 

      // var USE_Synthesizer_Z = false
      var USE_Synthesizer_Z = true

      if (USE_Synthesizer_Z === true) {

        // for testing the SVG
        MAIN_DATA.zoomIndex = originalZoomIndex;

        // mutate the layers to match the zoom
        MAIN_DATA.layersCount = originalZoomIndex

        var Synthesizer_Z = SynthesizerRoutine_CM({

            Geometry : MAIN_DATA.Geometry,
            trixelCount : MAIN_DATA.trixelCount,
            layersCount : MAIN_DATA.layersCount,
            originalTrixels : MAIN_DATA.originalTrixels,
            // the default is full screen, later things can adjust this
            zoomIndex : originalZoomIndex, 
            gridIndex : MAIN_DATA.gridIndex
        });


        MAIN_DATA.Geometry.allTrixelsAsMeshes = Synthesizer_Z.trixelMeshesNewSet;

      };





      /*======================= ======================= ======================= 
        
          Bleed layer
            
      ======================= ======================= ======================= */ 



      // var USE_BleedLayerRoutine_Z = false
      var USE_BleedLayerRoutine_Z = true

      if (USE_BleedLayerRoutine_Z === true) {

        // for testing the SVG
        // MAIN_DATA.zoomIndex = originalZoomIndex;

        var BleedLayerRoutine_Z = BleedLayerRoutine_CM({

            Geometry : MAIN_DATA.Geometry,
            trixelCount : MAIN_DATA.trixelCount,
            layersCount : MAIN_DATA.layersCount,
            originalTrixels : MAIN_DATA.originalTrixels,
            // the default is full screen, later things can adjust this
            zoomIndex : MAIN_DATA.zoomIndex, 
            gridIndex : MAIN_DATA.gridIndex

        });


        MAIN_DATA.Geometry.allTrixelsAsMeshes = BleedLayerRoutine_Z.allTrixelsAsMeshes;

      };









      /*======================= 
        
          From here we would need to pass the Geometry Object
          The color data and trixel data to get would be 
          
          DONT repl then Geometry
          Its waaaaaaaaaaaay to slow to display
          
          Geometry.allTrixelsAsMeshes[4].material.color
          Geometry.allTrixelsAsMeshes[4].geometry.vertices
          
          var len = Geometry.allTrixelsAsMeshes.length;
          for (var i = 0; i < len; i++) {
            var t = Geometry.allTrixelsAsMeshes[i].geometry.vertices;
            var c = Geometry.allTrixelsAsMeshes[i].material.color;
            console.log("t",t,"c",c);
          };

          So this will need to then convert the color to an SVG readable color
          Geometry.allTrixelsAsMeshes[4].material.color.getStyle()
          or
          Geometry.allTrixelsAsMeshes[4].material.color.getHex()
          however hex gives hexadecimal not string text
          
          in the current but old color database that comes in the JSON object we have
          color: 'rgb(215,215,249)',
          This matches .getStyle() perfectly


      =======================*/ 




      /*======================= 
        
          The expected 
          Geometry.trixelMeshes
          simply needs the format of
          obj.geometry.vertices & obj.material.color | obj.material.opacity
          we dont need a full mesh object at this point

            
      =======================*/ 





      /*======================= 
        
          printer cutline
          We will need to screw around with this when we start to deal with
          highres mm of cut space
          the line itself can be larger then the trixel artspace
          the way they cut is not via a laser, its by hand to cut out the entire artspace
          of the cut line which is just sooo wrong, but this is how the printer is at the
          moment, other issues to solve like

      =======================*/ 

      // make this better
      // we do this -1 to match the art layers count not the bleed count
      var more = -1;
      var zoomValue = 14 * (MAIN_DATA.zoomIndex + more)
      // debugger
      MAIN_DATA.cutCircle = visualTools.buildHexCircle(zoomValue, 0xffeb52, false);
      // a = visualTools.buildHexCircle(zoomValue, 0xffeb52, false);
      // a.geometry.vertices


      var SVG_Object = createSVG({
        Geometry : MAIN_DATA.Geometry,
        fillGaps : true,
        mergePaths : true,
        width : options.width,
        layersCount : MAIN_DATA.layersCount,
        cutCircle : MAIN_DATA.cutCircle
      });


      /*======================= 
        
          JUST for the demo w'lee test out stickersheet
          wrapped in the single request since they share mostly the same 
          pipes routines

          as example nesting "quantumCard" here is stupid since its a pass not a pipe


      =======================*/ 
      
      // options.stickerSheet = true;

      if (options.quantumCard) {

        var card = new QuantumCardGenerator()
        var cardData = card.createCard(SVG_Object, {});
        SVG_Object.file = KeplerHeader + cardData;

        console.log("----------------- card --------------------------");
        console.log(cardData);

      }

      return Stickersheet({
        SVG_Object : SVG_Object,
        dpi : options.dpi,
        // spacing : options.spacing,
      });







      // var outputFilename = './test.txt';

      // // fs.writeFile(outputFilename, cardData, function(err) {
      // fs.writeFile(outputFilename, JSON.stringify(cardData, null, 4), function(err) {
      //     if(err) {
      //       console.log(err);
      //     } else {
      //       console.log("JSON saved to " + outputFilename);
      //     }
      // }); 



      // return cardData;
      // return SVG_Object;

      // normal SVG file out
      // return createSVG(MAIN_DATA.Geometry, options, MAIN_DATA.zoomIndex);


  }

  /*======================= ======================= ======================= 
    
      MODE SINGLE
      MODE SINGLE
      MODE SINGLE
      MODE SINGLE
      MODE SINGLE
      MODE SINGLE
        
  ======================= ======================= ======================= */ 
  
  function Mode_Single(options) {
    
    // var width = options.width;
    // var jsonData = options.trixels;

    // var BASE_UNIT = options.baseUnit;


    /*======================= 
      
        >>> Bleedlayer, refactor this into new file
          
    =======================*/ 

    var BLEEDLAYER_More = 0;
    // bleedlayer has been wired to create multiple layers
    // not sure its a strategy to use but its available
    // but for now we will just assign +1
    // if(options.bleedLayer > 0) {
    if(options.bleedLayer) {
      // options.layers += 1; // +1 for iso-bleed! this should just be +1
      var BLEEDLAYER_More = 1;
    }

    var layersCount = options.layers + BLEEDLAYER_More; // the default 
    var originalZoomIndex = options.zoomIndex + BLEEDLAYER_More; // the default 

    // here we could do a match if ZoomIndex === amountOfLayers and GridIndex === 0
    // to bypass the synthesizer step but since its crucial that both work
    // it might as well rely of Synth to work
    // so we'll leave it be for now unless we need to optimize speed


    var MAIN_DATA = {
      Geometry : null,
      trixelCount : null,
      layersCount : layersCount,
      originalTrixels : options.trixels,
      zoomIndex : layersCount, // the default is full screen, later things can adjust this
      gridIndex : options.gridIndex
    }

    // FROM HERE ON OUT dont access options.trixels.length
    // or options.layers



    MAIN_DATA.Geometry = WorldBuilder.init( 
      MAIN_DATA.layersCount, 
      options.baseUnit, 
      MAIN_DATA.originalTrixels
    );
    MAIN_DATA.trixelCount =  MAIN_DATA.Geometry.allTrixelsAsMeshes.length;

    /*======================= ======================= ======================= 
      
        Begin test adding module routines until it works

        Snyth would happen before the Bleed layer
        HOWEVER Bleed affects the inital layers count
        Sigh......
          
    ======================= ======================= ======================= */ 





    /*======================= ======================= ======================= 
      
        Synth
          
    ======================= ======================= ======================= */ 

    // var USE_Synthesizer_Z = false
    var USE_Synthesizer_Z = true;

    if (USE_Synthesizer_Z === true) {

      // for testing the SVG
      MAIN_DATA.zoomIndex = originalZoomIndex;

      // mutate the layers to match the zoom
      MAIN_DATA.layersCount = originalZoomIndex

      var Synthesizer_Z = SynthesizerRoutine_CM({

          Geometry : MAIN_DATA.Geometry,
          trixelCount : MAIN_DATA.trixelCount,
          layersCount : MAIN_DATA.layersCount,
          originalTrixels : MAIN_DATA.originalTrixels,
          // the default is full screen, later things can adjust this
          zoomIndex : originalZoomIndex, 
          gridIndex : MAIN_DATA.gridIndex
      });


      MAIN_DATA.Geometry.allTrixelsAsMeshes = Synthesizer_Z.trixelMeshesNewSet;

    };





    /*======================= ======================= ======================= 
      
        Bleed layer is not used in single
        but fr now well leave it in untill we clean up the pipes process
          
    ======================= ======================= ======================= */ 



    var USE_BleedLayerRoutine_Z = false;
    if(options.bleedLayer > 0) {

      var USE_BleedLayerRoutine_Z = true;
    }

    if (USE_BleedLayerRoutine_Z === true) {

      // for testing the SVG
      // MAIN_DATA.zoomIndex = originalZoomIndex;

      var BleedLayerRoutine_Z = BleedLayerRoutine_CM({

          Geometry : MAIN_DATA.Geometry,
          trixelCount : MAIN_DATA.trixelCount,
          layersCount : MAIN_DATA.layersCount,
          originalTrixels : MAIN_DATA.originalTrixels,
          // the default is full screen, later things can adjust this
          zoomIndex : MAIN_DATA.zoomIndex, 
          gridIndex : MAIN_DATA.gridIndex

      });


      MAIN_DATA.Geometry.allTrixelsAsMeshes = BleedLayerRoutine_Z.allTrixelsAsMeshes;

    };









    /*======================= 
      
        From here we would need to pass the Geometry Object
        The color data and trixel data to get would be 
        
        DONT repl then Geometry
        Its waaaaaaaaaaaay to slow to display
        
        Geometry.allTrixelsAsMeshes[4].material.color
        Geometry.allTrixelsAsMeshes[4].geometry.vertices
        
        var len = Geometry.allTrixelsAsMeshes.length;
        for (var i = 0; i < len; i++) {
          var t = Geometry.allTrixelsAsMeshes[i].geometry.vertices;
          var c = Geometry.allTrixelsAsMeshes[i].material.color;
          console.log("t",t,"c",c);
        };

        So this will need to then convert the color to an SVG readable color
        Geometry.allTrixelsAsMeshes[4].material.color.getStyle()
        or
        Geometry.allTrixelsAsMeshes[4].material.color.getHex()
        however hex gives hexadecimal not string text
        
        in the current but old color database that comes in the JSON object we have
        color: 'rgb(215,215,249)',
        This matches .getStyle() perfectly


    =======================*/ 




    /*======================= 
      
        The expected 
        Geometry.trixelMeshes
        simply needs the format of
        obj.geometry.vertices & obj.material.color | obj.material.opacity
        we dont need a full mesh object at this point

          
    =======================*/ 





    /*======================= 
      
        printer cutline
        We will need to screw around with this when we start to deal with
        highres mm of cut space
        the line itself can be larger then the trixel artspace
        the way they cut is not via a laser, its by hand to cut out the entire artspace
        of the cut line which is just sooo wrong, but this is how the printer is at the
        moment, other issues to solve like

    =======================*/ 

    // make this better
    // we do this -1 to match the art layers count not the bleed count
    var more = -1;
    var zoomValue = 14 * (MAIN_DATA.zoomIndex + more)
    // debugger
    MAIN_DATA.cutCircle = visualTools.buildHexCircle(zoomValue, 0xffeb52, false);
    // a = visualTools.buildHexCircle(zoomValue, 0xffeb52, false);
    // a.geometry.vertices


    var SVG_Object = createSVG({
      Geometry : MAIN_DATA.Geometry,
      fillGaps : true,
      mergePaths : true,
      width : options.width,
      layersCount : MAIN_DATA.layersCount,
      // cutCircle : MAIN_DATA.cutCircle
    });


    /*======================= 
      
        JUST for the demo w'lee test out stickersheet
        wrapped in the single request since they share mostly the same 
        pipes routines

        as example nesting "quantumCard" here is stupid since its a pass not a pipe


    =======================*/ 
    
    // options.stickerSheet = true;

    if (options.quantumCard) {

      var card = new QuantumCardGenerator()
      var cardData = card.createCard(SVG_Object, {});
      SVG_Object.file = KeplerHeader + cardData;

      console.log("----------------- card --------------------------");
      console.log(cardData);

    }
   




    // var outputFilename = './test.txt';

    // // fs.writeFile(outputFilename, cardData, function(err) {
    // fs.writeFile(outputFilename, JSON.stringify(cardData, null, 4), function(err) {
    //     if(err) {
    //       console.log(err);
    //     } else {
    //       console.log("JSON saved to " + outputFilename);
    //     }
    // }); 







    // return cardData;
    return SVG_Object;

    // normal SVG file out
    // return createSVG(MAIN_DATA.Geometry, options, MAIN_DATA.zoomIndex);


  }















};

