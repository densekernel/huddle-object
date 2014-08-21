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

Use Meteorite, the Meteor Package Manager, to add the HuddleObject API to the Meteor project.

`$ mrt add huddleobject`

Now, if all three of the required packages are included in the Meteor project, the shell window will return a confirmation message similar to below.

`✓ huddle`<br>
`    tag: https://github.com/raedle/meteor-huddle.git#v0.9.3-7`<br>
`✓ huddlecanvas`<br>
`    tag: https://github.com/scarrobin/HuddleCanvas.git#v0.6.3`<br>
`✓ huddleobject`<br>
`    tag: https://github.com/jonnymanf/HuddleObject.git#v0.1.2`<br>

<b>n.b.</b> Version numbers of packages correct at time of writing.

Adding objects to the canvas is no different to adding normal 



