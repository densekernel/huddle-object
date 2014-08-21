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
    Meteor.subscribe('objectPosition');
    window.HuddleObjectCollection = HuddleObjectCollection;
}

if (Meteor.isServer) {
	Meteor.publish('objectPosition', function() {
		return ObjectPosition.find();
	})
}