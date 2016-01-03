import Ember from 'ember';
import createUnitCodeLine from 'tower-defense/utils/create-unit-code-line';

export default Ember.Component.extend({
  classNames: ['stylesheet__block'],

  tagName: 'ol',

  twrGrpCodeLine: createUnitCodeLine(),

  selector: Ember.computed(
    'attrs.tower.selector',
    'attrs.towerGroup.selector',
    function () {
      return this.attrs.tower ?
             this.attrs.tower.get('selector') :
             this.attrs.towerGroup.get('selector');
    }
  ),

  actions: {
    editCodeLine(/*uid*/) {
      this.set('twrGrpCodeLine.submitted', false);
    },

    enterCodeLine(codeStr/*, uid*/) {
      this.set('twrGrpCodeLine.codeLine', codeStr);
      this.set('twrGrpCodeLine.submitted', true);
    }
  }
});
