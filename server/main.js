import { Meteor } from 'meteor/meteor';
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
		
	}
})

// Meteor.publish( 'userList', function () { 
//   return Meteor.users.find({});
// });