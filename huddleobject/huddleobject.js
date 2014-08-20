if (Meteor.isClient) {
  
  // Create HuddleCanvas layer
  var canvas = HuddleCanvas.create("huddle-orbiter.proxemicinteractions.org", 51097, "huddleobject", {
    panningEnabled: true,
    backgroundImage: "../../i/map.jpg",
    showDebugBox: true,
    layers: ["huddle-layer"]
  });

  /*
   * Setup Huddle-Object within a window.onload function()
   */
  window.onload = function() {

    /*
     * Deps.autorun code block
     */

    setupEventListeners();
    

    Deps.autorun(function() {

      /*
       * Every iteration
       */
      if(objectPositionLoaded === true) {
        updateObjects();  
      }
      
      HuddleCanvas.panUnlock();

      /*
       * Setup functions
       */

      if(ObjectPosition.find().count() != 0) {
        console.log("### ObjectPosition loaded");
        console.log(ObjectPosition.find().fetch());
        objectCollectionLoaded = true;
        
      }

      if(objectCollectionLoaded === true && objectPositionLoaded === false) {
        console.log("EXECUTE IF STATEMENT");
        reloadObjects();
        objectPositionLoaded = true;
      }

    });


  } // End window.onload function()
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}


/*
 * Initialise Meteor collection
 */ 

ObjectPosition = new Meteor.Collection('objectPosition');

/*
 * API variables
 */ 

var objectCollectionLoaded = false;
var objectPositionLoaded = false;
var minScale = 0.5;

/*
 * API functions
 */

// Setup event listeners for any element with class ".huddle-object"
function setupEventListeners() {

  console.log(DDP._allSubscriptionsReady());

  var objectElements = document.getElementsByClassName("huddle-object");
  var objectEventListeners = [];

  // Check if meteor collection has loaded
  console.log("### Object Position Collection");
  console.log(ObjectPosition.find().fetch());


  for (i = 0; i < objectElements.length; i++) {

    // Create Hammer JS Event Listener
    objectEventListeners[i] = Hammer(objectElements[i], {
      preventDefault: true
    });
    objectEventListeners[i].get('pinch').set({enable: true});
    objectEventListeners[i].on('panstart panmove panend pinchstart pinchmove pinchend', function(ev) {

      var target = ev.target.id;
      console.log("### Hammer JS Event");
      console.log("## Target Element " + target);
      console.log(ev);
        
      /*
       * Functions to manipulate objects
       */

      objectTransform(ev, target);
        
    });

    // debug: console Hammer JS Event listener
    console.log("### HammerJS Event Listener");
    console.log(objectEventListeners[i]);

  }

}

function insertObject(target) {
  // Get css values of target element
  var originTop = parseInt($('#' + target).css('top'));
  var originLeft = parseInt($('#' + target).css('left'));
  var currentTop = parseInt($('#' + target).css('top'));
  var currentLeft = parseInt($('#' + target).css('left'));
  var objectWidth = parseInt($('#' + target).css('width'));
  var objectHeight = parseInt($('#' + target).css('height'));

  //console.log("# TOP: " + currentTop + " LEFT: " + currentLeft);



  // Insert initial data into Meteor Collection
  var objectData = {
    "id" : target,
    "originTop" : originTop,
    "originLeft" : originLeft,
    "deltaTop" : originTop,
    "deltaLeft" : originLeft,
    "originScale" : 1.0,
    "deltaScale" : 1.0,
    "originRotate" : 0,
    "deltaRotate" : 0,

  };
  
  // insert into ObjectPosition collection if not already there
  if(!ObjectPosition.findOne({'id' : target}) && target != "") {
    ObjectPosition.insert(objectData);
    console.log("## Object inserted!");
    console.log(ObjectPosition.findOne({'id': target}));  
  }
}

function reloadObjects() {
  console.log(ObjectPosition.find().fetch());
  var objectElements = document.getElementsByClassName("huddle-object");

  for(var i = 0; i < objectElements.length; i++) {

    var id = objectElements[i].id;
    var currentObject = ObjectPosition.findOne({'id' : id});
    console.log("### reloadObjects" + currentObject);
    console.log(currentObject);

    //getTransformValues(id);

    if(currentObject) {
      $('#' + id).css('top', currentObject.originTop + 'px');
      $('#' + id).css('left', currentObject.originLeft + 'px');
      applyAllBrowsers(
        '#' + id, 
        'transform', 
        'scale(' + currentObject.originScale + 
        ') rotate(' + currentObject.originRotate + 'deg)'
      );
    }
  }
}

function updateObjects() {
  var objectElements = document.getElementsByClassName("huddle-object");

  for(var i = 0; i < objectElements.length; i++) {

    var id = objectElements[i].id;
    var currentObject = ObjectPosition.findOne({'id' : id});
    console.log("### updateObjects currentObject");
    console.log(currentObject);

    if(currentObject) {
      $('#' + id).css('top', currentObject.deltaTop);
      $('#' + id).css('left', currentObject.deltaLeft);
      applyAllBrowsers(
        '#' + id, 
        'transform', 
        'scale(' + currentObject.deltaScale + 
        ') rotate(' + currentObject.deltaRotate + 'deg)'
      );

    }
  }
}


// Function to move object using two-finger drag gesture
function objectTransform(ev, target) {

    console.log("## Transform Gesture" + target);
    console.log(ev);

    // Check if collection requires insertion of target element
    insertObject(target);

    // Pause background panning
    HuddleCanvas.panLock();

    // Get data from Hammer JS event
    var currentAngle = HuddleCanvas.getHuddleData().Orientation;
    var angle = currentAngle * Math.PI / 180.0;
    var dx = ev.deltaX;
    var dy = ev.deltaY;
    var objectOffsetX = (Math.cos(angle) * dx) - (Math.sin(angle) * dy);
    var objectOffsetY = (Math.sin(angle) * dx) + (Math.cos(angle) * dy);
    var scale = (Math.round(ev.scale*10))/10;
    var rotation = Math.round(ev.rotation);
    var rotationFix;

    // Debug to visualise event data on tablet
    HuddleCanvas.debugWrite(scale + " " + rotation);

    var currentObject = ObjectPosition.findOne({'id' : target});
    console.log("## currentObject");
    console.log(currentObject);  

    // Update collection values
    ObjectPosition.update(currentObject._id, {
      $set: {
          deltaTop: currentObject.originTop + objectOffsetY,
          deltaLeft: currentObject.originLeft + objectOffsetX,
          deltaScale: currentObject.originScale * scale,
          deltaRotate: currentObject.originRotate + rotation
      }

    });

    // Finalise collection values
    if (ev.type === 'panend' || ev.type === 'pinchend') {
      HuddleCanvas.debugWrite(ev.type);

      ObjectPosition.update(currentObject._id, {
          $set: {
              originTop: currentObject.deltaTop,
              originLeft: currentObject.deltaLeft,
              originScale: currentObject.deltaScale,
              originRotate: currentObject.deltaRotate
          }

      });
    }

    // debug: console ObjectPosition update
    console.log(ObjectPosition.find().fetch());

}

// Function to apply webkit to all browsers 
function applyAllBrowsers(element, action, parameters) {
  var browserPrefixes = [
      "-o-",
      "-webkit-",
      "-ms-",
      "",
      "-moz-"
  ];
  for (z = 0; z < browserPrefixes.length; z++) {
      $(element).css(browserPrefixes[z] + action, parameters);
  }

}

function getTransformValues(target) {

  console.log("##### DEBUG TRANSFORM FUNCTION");

  var el = document.getElementById(target);
  var st = window.getComputedStyle(el, null);
  var tr = st.getPropertyValue("-webkit-transform") ||
           st.getPropertyValue("-moz-transform") ||
           st.getPropertyValue("-ms-transform") ||
           st.getPropertyValue("-o-transform") ||
           st.getPropertyValue("transform") ||
           "fail...";

  // With rotate(30deg)...
  // matrix(0.866025, 0.5, -0.5, 0.866025, 0px, 0px)
  console.log('Matrix: ' + tr);

  // rotation matrix - http://en.wikipedia.org/wiki/Rotation_matrix

  var values = tr.split('(')[1];
      values = values.split(')')[0];
      values = values.split(',');
  var a = values[0];
  var b = values[1];
  var c = values[2];
  var d = values[3];

  var scale = Math.sqrt(a*a + b*b);

  // arc sin, convert from radians to degrees, round
  // DO NOT USE: see update below
  var sin = b/scale;
  var angle = Math.round(Math.asin(sin) * (180/Math.PI));

  // works!
  
  console.log('Rotate: ' + angle + 'deg');
  console.log('Scale: ' + scale);
}
