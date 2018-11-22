import { Template } from 'meteor/templating';
import { Tasks } from './../../api/tasks.js';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Meteor } from 'meteor/meteor';

import './home.html';

Template.employee_page.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('employee_tasks');
});

Template.employee_page.helpers({
	tasks() {
		const instance = Template.instance();
		// Need to see this later after adding user specific permissions
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

Template.employee_page.events({
	'change .hide-completed input'(event, instance) {
		instance.state.set('hideCompleted', event.target.checked);
	},
});

Template.employee_tasks.events({
	'click .toggle-checked'() {
		Meteor.call('tasks.setChecked', this._id, !this.checked);
	}
});