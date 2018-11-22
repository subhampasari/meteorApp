import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const users = Meteor.users;

if ( Meteor.isServer ) {

	Meteor.publish( 'userList', function userPublications() { 
		return Meteor.users.find({});
	});

}

