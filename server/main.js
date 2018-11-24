import { Meteor } from 'meteor/meteor';
import { Tasks } from './../imports/api/tasks.js';
import './../imports/api/tasks.js';
import './../imports/api/users.js';

Meteor.startup(() => {
	if(!Meteor.users.findOne()) {
		var id = Accounts.createUser({
			email: 'admin@a.com',
			password: "apple1",
			profile: { name: 'admin' }
		});

		Roles.addUsersToRoles(id, 'admin');
	}

  // code to run on server at startup
});

Meteor.methods({
	add_manager( username, password ) {
		var id = Accounts.createUser( {
					email: username,
					password: password
				} );
		Roles.addUsersToRoles( id, ['manager'] );
		
	},
	add_client( username, password ) {
		var id = Accounts.createUser({
					email: username,
					password: password
				});
		Roles.addUsersToRoles(id, ['client']);
		
	},
	add_employee( username, password ) {
		var id = Accounts.createUser({
					email: username,
					password: password
				});
		Roles.addUsersToRoles(id, ['employee']);
		
	},
	assign_task_to_employee( task_id, employee ) {

		user =  Accounts.findUserByEmail(employee) ;
		if( Roles.userIsInRole( user._id, ['employee'] ) )
			Tasks.update({_id: task_id}, { $set : { "assigned_to" : employee} });
		else
		{
			throw new Meteor.Error('Tasks can only be assigned to employees!');
		}
	}
})

// Meteor.publish( 'userList', function () { 
//   return Meteor.users.find({});
// });