import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['tower-group__tower'],

  classNameBindings: ['currentTowerSelected:tower-group__tower--selected'],

  _sendSelectAction: Ember.on('click', function (clickEvent) {
    this.attrs.select(this.attrs.tower);

    clickEvent.stopPropagation();
  }),

  currentTowerSelected: Ember.computed(
    'attrs.selectedTower',
    'attrs.tower',
    function () {
      return this.attrs.selectedTower === this.attrs.tower ? true : false;
     }
  )
});
