import Ember from 'ember';
import ExtendEmberTextFieldInitializer from '../../../initializers/extend-ember-text-field';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | extend ember text field', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  ExtendEmberTextFieldInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
