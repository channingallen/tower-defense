import Ember from 'ember';
import AddInsertionDetectionToComponentsInitializer from '../../../initializers/add-insertion-detection-to-components';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | add insertion detection to components', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  AddInsertionDetectionToComponentsInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
