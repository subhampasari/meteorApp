import { Template } from 'meteor/templating';
import { Tasks } from './../../api/tasks.js';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Meteor } from 'meteor/meteor';

import './home.html';

Template.client_home.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('tasks', Meteor.userId() );
});

Template.client_home.helpers({
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
        { checked: { $ne: true } },
        { owner: Meteor.userId },
      ],
    }).count();
  },
});

Template.client_home.events({
  'submit .new-task'(event) {
    event.preventDefault();
    const target = event.target;
    const text = target.text.value;
    Meteor.call('tasks.insert', text);
    target.text.value = '';
  },

  'change .hide-completed input'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },
});

Template.task.events({
  'click .toggle-checked'() {
    // Set the checked property to the opposite of its current value
    Meteor.call('tasks.setChecked', this._id, !this.checked);
  },
  'click .delete'() {
    Meteor.call('tasks.remove', this._id);
  },
  // 'click .toggle-private'() {
  //   Meteor.call('tasks.setPrivate', this._id, !this.private);
  // }
});

Template.task.helpers({
  isOwner() {
    return this.owner === Meteor.userId();
  },
});
