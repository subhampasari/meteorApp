import { Template } from 'meteor/templating';
import { Tasks } from './../../api/tasks.js';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { users } from './../../api/users.js';

import './home.html';

Template.client_requests.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('all_tasks');
});

Template.client_requests.helpers({
	tasks() {
		const instance = Template.instance();
		if (instance.state.get('hideCompleted')) {
			// If hide completed is checked, filter tasks
			return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
		}
		// Otherwise, return all of the tasks
		return Tasks.find({}, { sort: { createdAt: -1 } });
	},
	incompleteCount() {
		return Tasks.find({
			$and: [
				{ checked: { $ne: true } }
			],
		}).count();
	},
});

Template.client_requests.events({
	'change .hide-completed input'(event, instance) {
		instance.state.set( 'hideCompleted', event.target.checked );
	},
});

Template.add_employee.events({
	'submit form' : function( event ) {
		event.preventDefault();
		var username = event.target.email.value;
		var password = event.target.password.value;
		Meteor.call( 'add_employee', username, password, function( error, result ) {
			if( error )
				sAlert.error( 'Error creating employee!' );
			else
				sAlert.success( 'Registered employee successfully', { timeout : 3000 } );
		} );
	}
})

Template.employee_list.onCreated( function bodyOnCreated()
{
	this.state = new ReactiveDict();
	Meteor.subscribe('userList');
})

Template.employee_list.helpers({
	users() {
		const instance = Template.instance();
		return Roles.getUsersInRole(['employee'])
	},
	email() {
		// if( Roles.userIsInRole( this._id, ['manager']) )
			return this.emails[0].address; 
	}
})

Template.all_task.events({
	'click .assign_task' : function( event ) {
		event.preventDefault();
		console.log( event.target );
	}
})

