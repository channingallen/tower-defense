import Ember from 'ember';
import AddForceSetInitializer from '../../../initializers/add-force-set';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | add force set', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  AddForceSetInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
