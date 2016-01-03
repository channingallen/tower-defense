import Ember from 'ember';

const UnitCodeLine = Ember.Object.extend({
  codeLine: undefined,
  submitted: false,
  uid: null,
  unitType: null // tower or tower group
});

export default UnitCodeLine;
