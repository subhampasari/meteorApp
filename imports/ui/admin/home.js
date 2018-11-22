import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { users } from './../../api/users.js';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Meteor } from 'meteor/meteor';

import './home.html';

var form = $('\
			<form class="form" role="form">\
				<div class="form-group">\
					<label for="email">Email address</label>\
					<input type="email" class="form-control" id="email" name="email" placeholder="Enter email" value="test@mail.ru"></input>\
				</div>\
				\
				<div class="form-group">\
					<label for="password">Password</label>\
					<input type="password" class="form-control" id="password" name="password" placeholder="Password">\
				</div>\
			</form>\
			');

Template.managers_list.onCreated( function bodyOnCreated()
{
	this.state = new ReactiveDict();
	Meteor.subscribe('userList');
})

Template.clients_list.onCreated( function bodyOnCreated()
{
	this.state = new ReactiveDict();
	Meteor.subscribe('userList');
})

Template.managers_list.helpers({

	users : function() {
		const instance = Template.instance();
		return Roles.getUsersInRole(['manager'])
		// return users.find({});
	},
	email() {
		// if( Roles.userIsInRole( this._id, ['manager']) )
			return this.emails[0].address; 
	}

});

Template.clients_list.helpers({

	users : function() {
		const instance = Template.instance();
		
		return Roles.getUsersInRole(['client'])
	},
	email(){
		// if( Roles.userIsInRole( this._id, ['client']) )
			return this.emails[0].address; 
	}

});

Template.admin_home.events(
{
	'click .add_manager' : function( event ) {
		event.preventDefault();
		var manager_modal  = bootbox.dialog({
			message: form,
			title: "Add Manager",
			buttons : [{
				label: "Save",
            	className: "btn btn-primary pull-left",
            	callback: function() {
            		var username = form.find('input[name=email]').val();
            		var password = form.find('input[name=password]').val();
            		Meteor.call( 'add_manager',username,password, function( error, success ) {
            			if( error )
            				sAlert.error( 'Error creating manager!' );
						else
							sAlert.success( 'Registered manager successfully', { timeout : 3000 } );
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
	        	manager_modal.modal("hide");
	        }
	    });
		manager_modal.modal("show");
	},
	'click .add_client' : function( event ) {
		event.preventDefault();
		var client_modal  = bootbox.dialog({
			message: form,
			title: "Add Client",
			buttons : [{
				label: "Save",
            	className: "btn btn-primary pull-left",
            	callback: function() {
            		var username = form.find('input[name=email]').val();
            		var password = form.find('input[name=password]').val();
					Meteor.call( 'add_client', username, password, function( error, success ) {
						if( error )
            				sAlert.error( 'Error creating client!' );
						else
							sAlert.success( 'Registered client successfully', { timeout : 3000 } );
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
});