var HuddleObjectCollection = (function() {
    ObjectPosition = new Meteor.Collection('objectPosition');

    var getObjectCollection = function() {
        return ObjectPosition;
    }

    return {
        getObjectCollection: getObjectCollection
    }
})();

if (Meteor.isClient) {
    window.HuddleObjectCollection = HuddleObjectCollection;
}