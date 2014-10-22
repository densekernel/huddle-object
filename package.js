Package.describe({
    summary: "HuddleObject - Add HTML div elements to HuddleCanvas with support for multi-touch gestures",
    version: "0.5.1",
    name: "huddle:object",
    git: 'https://github.com/jonnymanf/HuddleObject.git'
});

Package.on_use(function(api) {
    api.use('jquery@1.0.0', 'client');
    api.use('mongo@1.0.4', ['client', 'server']);
    api.imply('jquery@1.0.0', 'client');
    api.add_files([
        'huddleobject.js',
        'huddleobject.css'
    ], 'client');
    api.add_files([
        'objectcollection.js'
    ], ['server', 'client']);
});