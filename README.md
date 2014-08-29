HuddleObject API
============

HuddleObject: An API to allow the easy inclusion of HTML objects on a HuddleCanvas with support for HammerJS multi-touch gestures.

<b>n.b.</b> Use of the HuddleObject API requires use of the [Huddle API](https://github.com/raedle/meteor-huddle) and [HuddleCanvas API](https://github.com/scarrobin/huddlecanvas).

## Getting started

To begin, follow the instructions outlined in the [HuddleCanvas API](https://github.com/scarrobin/huddlecanvas) documentation.

This will cover:

1. Installing [Meteor](https://www.meteor.com/)
2. Installing Meteor's Package Manager [Meteorite](http://oortcloud.github.io/meteorite/)
3. Creating a Meteor project
4. Adding Huddle API
5. Adding HuddleCanvas API
6. Using HuddleCanvas

<b>n.b.</b> Although this is a six-step process, steps 1. and 2. are only required for first time users of Meteor and Meteorite. The remainder of the instructions can be completed rapidly, primarily using command line prompts and basic HTML/CSS/JS.

Once the above steps from the HuddleCanvas documentation have been completed, the HuddleObject API can be integrated with the Meteor Project.

## Using HuddleObject - The Basics

This section explains the basics of HuddleObject. To demonstrate integration from a clean install, the HuddleCanvas instructions were followed in a new project called "HuddleDocumentation".

When using the Huddle API's, the main development area consists of three generated files in the root directory of the new Meteor project.

Given the example project title "HuddleDocumentation", the above mentioned files should be generated as:

- "HuddleDocumentation.css"
- "HuddleDocumentation.html"
- "HuddleDocumentation.js"

If the HuddleCanvas documentation was followed correctly, the files will have been edited to have content similar to the following examples. 

<b>HuddleDocumentation.html</b>

```html
<head>
  <title>HuddleDocumentation</title>
  <!-- Insert below meta tags -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-title" content="painting demo">
  <meta name="viewport" content="minimal-ui, width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
</head>

<body>
	<div id="huddle-canvas-container">
		<div id="huddle-layer">
		</div>
	</div>
</body>
```

<b>HuddleDocumentation.js</b>

```javascript
if (Meteor.isClient) {
  var canvas = HuddleCanvas.create("huddle-orbiter.proxemicinteractions.org", 60000, "HuddleDocumentation", {
    panningEnabled: true,
    backgroundImage: "../../map.jpg",
    showDebugBox: true,
    layers: ["huddle-layer"]
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
```

The parameters passed into the HuddleCanvas.create() function may vary slightly, in the example it is connected to the [HuddleOrbiter](http://huddle-orbiter.proxemicinteractions.org:3000/) simulator and settings have been enabled with a background image assigned. 

<b>n.b.</b> A small note to those implementing a HuddleCanvas with a background image: The "backgroundImage" setting may need to be prefixed with "../../", this will access images placed in a folder within your meteor project called "public". This folder may need creating.

<b>Summary</b>

Once this stage in the development is reached, the project should be runnable in the Meteor environment with a pannable background image. Now, let's add objects.

## Using HuddleObject - Adding objects

Use the Meteor Package Manager to add the HuddleObject API to the Meteor project.

`$ meteor add jay5:huddleobject`

Now, if all three of the required packages are included in the Meteor project, the shell window will return a confirmation message similar to below.

`✓ huddle`<br>
`    tag: https://github.com/raedle/meteor-huddle.git#v0.9.3-7`<br>
`✓ huddlecanvas`<br>
`    tag: https://github.com/scarrobin/HuddleCanvas.git#v0.6.3`<br>
`✓ huddleobject`<br>
`    tag: https://github.com/jonnymanf/HuddleObject.git#v0.1.2`<br>

<b>n.b.</b> Version numbers of packages correct at time of writing.

Adding objects to the canvas is no different to adding HTML div elements to a webpage and styling them with CSS.

<b>HuddleDocumentation.css</b>

The CSS file needs to be updated with some <b>mandatory</b> and optional styles for any element we intend to add to the canvas.



```css
/* CSS declarations go here */

#test-object {
	width: 200px;
	height: 200px;
	top: 100px;
	left: 100px;
	background-color: yellow;
	color: purple;
}
```

In the example, the object we add will take the ID attribute "test-object".

Some points to consider:

- <b>top</b> A default top property must be defined, 0px is fine.
- <b>left</b> A default left property must be defined, 0px is fine.
- The rest of the CSS styles are optional!

<b>HuddleDocumentation.html</b>

The HTML file needs to be updated to include the mark-up for the Huddle Object element.

```html
<head>
  <title>HuddleDocumentation</title>
</head>

<body>
	<div id="huddle-canvas-container">
		<div id="object-layer">
			<div id="test-object" class="huddle-object">
				<span>Hello world!</span>
			</div>
		</div>
	</div>
</body>
```

To add an object we simply create a nested ```<div></div>``` element within ```<div id="object-layer"></div>```

Points to consider:

- <b>ID attribute</b> All parent elements need to be given a unique ID attribute
- <b>Class attribute</b> All parent elements need to be given the "huddle-object" class attribute

<b>HuddleDocumentation.js</b>

Finally, we need to update the JavaScript file to include a call to the HuddleObject API function which initialises the Huddle Objects.

```javascript
if (Meteor.isClient) {
  var canvas = HuddleCanvas.create("huddle-orbiter.proxemicinteractions.org", 60000, "HuddleDocumentation", {
    panningEnabled: true,
    backgroundImage: "../../map.jpg",
    showDebugBox: true,
    layers: ["object-layer"]
  });
  
  // code for HuddleObject inside window.onload function
  window.onload = function() {
    HuddleObject.initObjects();
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
```

The initObjects() call initialises a Meteor Collection to store information about Huddle Objects and sets up the HammerJS event listeners. Following this, a Deps.autorun() function is implemented that will automatically update Huddle Object's positions based on the transformations applied. This is synchronised across all the devices within the Huddle.

Points to consider:

- <b>window.onload</b> function is where to make calls to the HuddleObject API from

<b>Summary</b>

Well done! A Huddle Object should now successfully be added to the canvas. Gestures are automatically disabled until the correct classed are applied. Apply them following the instructions in the section below anduse a tablet device available to try them out. See the next section for more information on gestures.

## Using HuddleObject - Gestures

Huddle Objects currently support the following multi-touch gestures using HammerJS event listeners to capture information about the gesture.

All transformations are applied through the objectTransform() function in the API.

By default, all gestures are disabled, even after the `.huddle-objects` has been applied. Simply add the class attributes shown in the sections below for each gesture to enable them.

<b>One finger drag</b>

Dragging a Huddle Object with one finger will move it about the canvas.

Enable class: `.can-drag`

<b>Two finger pinch</b>

Pinching the item will scale it based on the increase or decrease in proximity of the two pointers.

Enable class: `.can-scale`

<b>Two finger rotate</b>

With two fingers, a Huddle Object can also be rotated.

Enable class: `.can-rotate`

<b>Elastic</b>

The shape will return to its original position, orientation and scale after temporary manipulation.

Enable class: `.is-elastic`

<b>Summary</b>

A HMTL div with all gestures enabled will therefore have class attributes similar to the following:

```html
<div id="test-object" class="huddle-object can-drag can-scale can-rotate">
  <span>Hello world!</span>
</div>
```

## Using HuddleObject - Sessions

When an object is first added to the canvas, it won't be added to the Meteor Collection until it is interacted with via touch gesture. Once inserted into the Meteor Collection, an up-to-date set of data regarding co-ordinates, orientation and scale are kept so upon reload, Huddle Objects will be in the same position that they were when last interacted with.

They can be defaulted to their CSS properties by running the following command in terminal:

`$ meteor reset`

## Example Gist

The idea behind HuddleObject is to create an environment where an application can be created with its own scripts and logic, making use of the simplicity of the gestures. For demonstration purposes, see the following gist for an example involving a university map and nearby tube stations.

https://gist.github.com/jonnymanf/92c08bdf4c593650905c

Assets for the map and icon files, referenced in the CSS file, will need to be provided, simply include them within the directory `public` in the Meteor project's root.


