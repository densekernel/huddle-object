Package.describe({
  name: "huddle:object",
  summary: "HuddleObject - Add HTML div elements to HuddleCanvas with support for multi-touch gestures",
  version: "0.5.1_1",
  git: 'https://github.com/jonnymanf/HuddleObject.git'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@0.9.0');

  // used external packages
  api.use('jquery@1.0.0', 'client');
  api.use('mongo@1.0.4');
  api.use('huddle:client@0.9.14', 'client');
  api.use('huddle:canvas@1.3.0_1', 'client');

  // allow to use referenced packages
  api.imply('jquery@1.0.0', 'client');
  api.imply('huddle:canvas@1.3.0_1', 'client');

  // export objects
  api.export('HuddleObject', 'client');
  api.export('HuddleObjectCollection', 'client');

  // API files
  api.addFiles('api/huddle:object.js', 'client');
  api.addFiles('api/huddle:object.css', 'client');
  api.addFiles('api/huddle:object-objectcollection.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('huddle:object');
  api.addFiles('test/huddle:object-tests.js');
});
