Package.describe({
    summary: "HuddleObject - Add HTML div elements to HuddleCanvas with support for multi-touch gestures"
});

Package.on_use(function(api) {
    api.use('jquery', 'client');
    api.imply('jquery', 'client');
    api.add_files([
        'huddleobject.js',
        'huddleobject.css'
    ], 'client');
    api.add_files([
        'objectcollection.js'
    ], ['server', 'client']);
});