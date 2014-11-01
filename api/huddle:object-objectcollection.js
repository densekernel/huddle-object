var ObjectPosition = new Mongo.Collection('huddle-object-position');

/**
 * Wrapper to hold huddle object collection.
 */
HuddleObjectCollection = (function() {

  var getObjectCollection = function() {
    return ObjectPosition;
  };

  return {
    getObjectCollection: getObjectCollection
  };
})();

if (Meteor.isClient) {
  Meteor.subscribe('huddle-object-position');
}

if (Meteor.isServer) {
  Meteor.publish('huddle-object-position', function() {
    return ObjectPosition.find();
  });

  ObjectPosition.allow({
    insert: function (userId, post) {
      return true;
    },
    update: function(userId, document, fieldNames, modifier) {
      return true;
    },
    remove: function (userId, post) {
      return true;
    }
  });
}

// Meteor.methods({
//   updateObject: function() {
//
//   },
// });
