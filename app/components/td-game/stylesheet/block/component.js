import Ember from 'ember';
import createUnitCodeLine from 'tower-defense/utils/create-unit-code-line';

export default Ember.Component.extend({
  classNames: ['stylesheet__block'],

  tagName: 'ol',

  twrCodeLine: createUnitCodeLine(),

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
    editCodeLine(unitType/*, uid*/) {
      const unitProperty = unitType === 'tower' ?
                                        'twrCodeLine' :
                                        'twrGrpCodeLine';

      this.set(unitProperty + '.submitted', false);
    },

    enterCodeLine(codeStr, unitType/*, uid*/) {
      const unitProperty = unitType === 'tower' ?
                                        'twrCodeLine' :
                                        'twrGrpCodeLine';

      this.set(unitProperty + '.codeLine', codeStr);
      this.set(unitProperty + '.submitted', true);
    }
  }
});
