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
		return this.emails[0].address; 
	}
})

var form = $('\
			<form class="form" role="form">\
				<div class="form-group">\
					<label for="email">Employee Email address : </label>\
					<input type="email" class="form-control" id="email" name="email" placeholder="Enter email" value=""></input>\
				</div>\
				\
			</form>\
			');

Template.all_task.events({
	'click .assign_task' : function( event ) {
		event.preventDefault();
		// console.log( this._id );
		var task_id = this._id;

		var client_modal  = bootbox.dialog({
			message: form,
			title: "Assign \"" + this.text + "\" to employee",
			buttons : [{
				label: "Save",
            	className: "btn btn-primary pull-left",
            	callback: function() {
            		var employee = form.find('input[name=email]').val();

            		

					Meteor.call( 'assign_task_to_employee', task_id, employee, function( error, success ) {
						if( error )
            				sAlert.error( 'Error Assigning Task!' + error );
						else
							sAlert.success( 'Successfully Assigned Task!', { timeout : 3000 } );
					} );
            	}
			},
			{
				label: "Close",
	            className: "btn btn-default pull-left",
	            callback: function() {}
			}],
			show: false,
			onEscape: function() {
	        	client_modal.modal("hide");
	        }
	    });
		client_modal.modal("show");


	}
})

