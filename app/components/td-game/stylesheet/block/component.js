import Ember from 'ember';
import createUnitCodeLine from 'tower-defense/utils/create-unit-code-line';

export default Ember.Component.extend({
  classNames: ['stylesheet__block'],

  tagName: 'ol',

  twrCodeLines: Ember.A([createUnitCodeLine()]),

  twrGrpCodeLines: Ember.A([createUnitCodeLine()]),

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
    editCodeLine(unitType, id) {
      const codeLinesProp = unitType === 'tower' ?
                                         'twrCodeLines' :
                                         'twrGrpCodeLines';

      this.get(codeLinesProp).forEach((unitCodeLine) => {
        if (unitCodeLine.get('id') === id) {
          unitCodeLine.set('submitted', false);
        }
      });
    },

    enterCodeLine(codeStr, unitType, id) {
      const codeLinesProp = unitType === 'tower' ?
                                         'twrCodeLines' :
                                         'twrGrpCodeLines';

      this.get(codeLinesProp).forEach((unitCodeLine) => {
        if (unitCodeLine.get('id') === id) {
          unitCodeLine.set('codeLine', codeStr);
          unitCodeLine.set('submitted', true);
        }
      });
    }
  }
});
