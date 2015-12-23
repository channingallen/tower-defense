import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['stylesheet__block'],

  tagName: 'ol',

  selector: Ember.computed(
    'attrs.tower.selector',
    'attrs.towerGroup.selector',
    function () {
      return this.attrs.tower ?
             this.attrs.tower.get('selector') :
             this.attrs.towerGroup.get('selector');
    }
  )
});
