import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';


import './main.html';
import './../imports/ui/index/home.js';


if ( Meteor.isClient ) {

	Template.login.events({
		'submit form': function(event) {
			event.preventDefault();
			var emailVar = event.target.loginEmail.value;
			var passwordVar = event.target.loginPassword.value;
			Meteor.loginWithPassword( emailVar, passwordVar );
			sAlert.success('Logged In', { timeout : 2000 });
		}
	});

	Template.body.events({
		'click .logout': function(event) {
			event.preventDefault();
			Meteor.logout();
			sAlert.success('Logged Out', { timeout : 2000 });
		}
	});

	Template.body.helpers({
		role : function(){
			if( Roles.userIsInRole( Meteor.user(), ['employee']) )
				return "Employee";
			else if ( Roles.userIsInRole( Meteor.user(), ['manager']) === true )
				return "Manager";
			else if ( Roles.userIsInRole( Meteor.user(), ['client']) )
				return "Client";

			else if ( Roles.userIsInRole( Meteor.user(), ['admin']) )
				return "Admin";

			return "default";
		}
	})

}

if (Meteor.isServer) {
	Meteor.startup(function () {
		// code to run on server at startup
	});
}