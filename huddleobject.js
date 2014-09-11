/*
 * Use module design patttern for API
 */

var HuddleObject = (function() {

    /*
     * API variables
     */

    // Initialise ObjectPosition Meteor Collection
    var ObjectPosition;
    var objectCollectionLoaded = false;
    var objectPositionLoaded = false;
    var minScale = 0.7;
    var startRotation = 0;
    var rotation;
    var previousRotation = 0;

    /*
     * API functions
     */

    // Initialise Huddle Objects
    function initObjects() {

        // Get cursor to ObjectPosition meteor collection
        ObjectPosition = HuddleObjectCollection.getObjectCollection();

        // Setup Hammer JS event listeners
        setupEventListeners();

        /*
         * Deps.autorun code block
         */

        Deps.autorun(function() {

            /*
             * Every iteration
             */
            if (objectPositionLoaded === true) {
                updateObjects();
            }

            HuddleCanvas.panUnlock();

            /*
             * Setup functions
             */

            if (ObjectPosition.find().count() != 0) {
                objectCollectionLoaded = true;
            }

            if (objectCollectionLoaded === true && objectPositionLoaded === false) {
                reloadObjects();
                objectPositionLoaded = true;
            }

        });
    }

    // Setup event listeners for any element with class ".huddle-object"
    function setupEventListeners() {

        var objectElements = document.getElementsByClassName("huddle-object");
        var objectEventListeners = [];

        for (i = 0; i < objectElements.length; i++) {

            // Create Hammer JS Event Listener
            objectEventListeners[i] = Hammer(objectElements[i], {
                preventDefault: true
            });
            objectEventListeners[i].get('pinch').set({
                enable: true
            });
            objectEventListeners[i].on('panstart panmove panend pinchstart pinchmove pinchend', function(ev) {

                var target = ev.target.id;
                // debug: print out target for Hammer JS event
                //console.log("### Hammer JS Event");
                //console.log("## Target Element " + target);

                /*
                 * Functions to manipulate objects
                 */

                objectTransform(ev, target);

            });

            // debug: console Hammer JS Event listener
            //console.log("### HammerJS Event Listener");
            //console.log(objectEventListeners[i]);

        }

    }


    // Function to insert an object in the ObjectPosition Collection
    function insertObject(target) {
        // Get css values of target element
        var originTop = parseInt($('#' + target).css('top'));
        var originLeft = parseInt($('#' + target).css('left'));
        var currentTop = parseInt($('#' + target).css('top'));
        var currentLeft = parseInt($('#' + target).css('left'));
        var objectWidth = parseInt($('#' + target).css('width'));
        var objectHeight = parseInt($('#' + target).css('height'));

        // Insert initial data into objectData as object
        var objectData = {
            "id": target,
            "originTop": originTop,
            "originLeft": originLeft,
            "deltaTop": originTop,
            "deltaLeft": originLeft,
            "originScale": 1.0,
            "deltaScale": 1.0,
            "originRotate": 0,
            "deltaRotate": 0,
            "noAction": false
        };

        // insert into ObjectPosition collection if not already there
        if (!ObjectPosition.findOne({
            'id': target
        }) && target != "") {
            ObjectPosition.insert(objectData);
            // debug: See which data is inserted for that object
            //console.log("## Object inserted!");
            //console.log(ObjectPosition.findOne({'id': target}));  
        }
    }

    // Reload objects using the most up-to-date data in ObjectPosition collection
    function reloadObjects() {
        var objectElements = document.getElementsByClassName("huddle-object");

        for (var i = 0; i < objectElements.length; i++) {

            var id = objectElements[i].id;
            var currentObject = ObjectPosition.findOne({
                'id': id
            });

            if (currentObject) {
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

    // Update the CSS properties of objects once they have been transformed
    function updateObjects() {
        var objectElements = document.getElementsByClassName("huddle-object");

        for (var i = 0; i < objectElements.length; i++) {

            var id = objectElements[i].id;
            var currentObject = ObjectPosition.findOne({
                'id': id
            });

            if (currentObject) {
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

    // Function to transform objects
    function objectTransform(ev, target) {

        // Check if collection requires insertion of target element
        // See insertObject function()
        insertObject(target);

        // Pause background panning
        if ($("#" + target).hasClass("can-drag") ||
            $("#" + target).hasClass("can-scale") ||
            $("#" + target).hasClass("can-rotate")) {
            HuddleCanvas.panLock();
        }

        // Get data from Hammer JS event
        var currentAngle = -HuddleCanvas.getTotalRotation();
        var currentScale = HuddleCanvas.getTotalScale();

        var angle = currentAngle * Math.PI / 180.0;
        var dx = ev.deltaX / currentScale;
        var dy = ev.deltaY / currentScale;
        var objectOffsetX = (Math.cos(angle) * dx) - (Math.sin(angle) * dy);
        var objectOffsetY = (Math.sin(angle) * dx) + (Math.cos(angle) * dy);
        var scale = (Math.round(ev.scale * 10)) / 10;
        var eventRotation = Math.round(ev.rotation);
        rotation = previousRotation;

        // Select object from Meteor collection
        var currentObject = ObjectPosition.findOne({
            'id': target
        });

        // fix for 180 degree flip bug
        if ((!(Math.abs(startRotation - eventRotation) > 10)) ||
            Math.abs(eventRotation) < 10 ||
            (!(Math.abs(Math.abs(startRotation) - Math.abs(eventRotation)) > 10))
        ) {
            rotation = eventRotation;
            startRotation = rotation;

        }

        // Eliminate inapplicable gestures based on target elements class attributes
        if (!$("#" + target).hasClass("can-drag")) {
            objectOffsetX = 0;
            objectOffsetY = 0;
        }

        if (!$("#" + target).hasClass("can-scale")) {
            scale = currentObject.originScale;
        }

        if (!$("#" + target).hasClass("can-rotate")) {
            rotation = 0;
        }

        // Update collection values
        ObjectPosition.update(currentObject._id, {
            $set: {
                deltaTop: currentObject.originTop + objectOffsetY,
                deltaLeft: currentObject.originLeft + objectOffsetX,
                deltaScale: currentObject.originScale * scale,
                deltaRotate: currentObject.originRotate + rotation,
                noAction: !currentObject.noAction
            }
        });

        // Update collection values
        // Finalise collection values
        if ((ev.type === 'panend' || ev.type === 'pinchend') && !($('#' + target).hasClass('is-elastic'))) {
            //HuddleCanvas.debugWrite(ev.type);

            console.log(ev.type);
            if (ev.type === 'panend') {
                ObjectPosition.update(currentObject._id, {
                    $set: {
                        originTop: currentObject.deltaTop,
                        originLeft: currentObject.deltaLeft,
                    }

                });

            }

            ObjectPosition.update(currentObject._id, {
                $set: {
                    originScale: currentObject.deltaScale,
                    originRotate: currentObject.deltaRotate,
                    noAction: !currentObject.noAction
                }

            });
        }

        if ((ev.type === 'panend' || ev.type === 'pinchend') && $('#' + target).hasClass('is-elastic')) {
            animateReset(target, currentObject);
        }

        // debug: console ObjectPosition update
        //console.log(ObjectPosition.find().fetch());

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

    // function to animate an elastic elmement into origin position
    function animateReset(target, currentObject) {

        $('#' + target).animate({
            top: currentObject.originTop,
            left: currentObject.originLeft
        }, {
            duration: 300
        });
    }

    /*
     * Return API Functions
     */

    return {
        initObjects: initObjects
    }

})();

// Set HuddleObject to Global scope
window.HuddleObject = HuddleObject;