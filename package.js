Package.describe({
    summary: "HuddleObject - Add HTML div elements to HuddleCanvas with support for multi-touch gestures",
    version: "0.4.0",
    name: "jay5:huddleobject",
    git: 'https://github.com/jonnymanf/HuddleObject.git'
});

Package.on_use(function(api) {
    api.use('jquery@1.0.0', 'client');
    api.imply('jquery@1.0.0', 'client');
    api.add_files([
        'huddleobject.js',
        'huddleobject.css'
    ], 'client');
    api.add_files([
        'objectcollection.js'
    ], ['server', 'client']);
});