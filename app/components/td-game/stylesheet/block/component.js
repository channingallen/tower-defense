import Ember from 'ember';
import createUnitCodeLine from 'tower-defense/utils/create-unit-code-line';

export default Ember.Component.extend({
  classNames: ['stylesheet__block'],

  // unitCodeLines:
  // [
  //   {
  //     codeLine: undefined,
  //     submitted: false,
  //     id: null,
  //     unitType: null // tower or tower group
  //   },
  //   {...}
  // ]
  twrCodeLines: Ember.A([createUnitCodeLine()]),

  twrGrpCodeLines: Ember.A([createUnitCodeLine()]),

  tagName: 'ol',

  _deleteCodeLine(codeLinesProp, id) {
    const newCodeLinesProp = this.get(codeLinesProp).filter((unitCodeLine) => {
      return unitCodeLine.get('id') === id ? false : true;
    });

    this.set(codeLinesProp, newCodeLinesProp);
  },

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
    deleteCodeLine(unitType, id) {
      const codeLinesProp = unitType === 'tower' ?
                                         'twrCodeLines' :
                                         'twrGrpCodeLines';

      this._deleteCodeLine(codeLinesProp, id);

      // send updated code lines array up to stylesheet
      this.attrs['update-code-lines'](this.get(codeLinesProp));
    },

    editCodeLine(unitType, id) {
      const codeLinesProp = unitType === 'tower' ?
                                         'twrCodeLines' :
                                         'twrGrpCodeLines';

      let newCodeLineId;

      this.get(codeLinesProp).forEach((unitCodeLine) => {
        if (unitCodeLine.get('id') === id) {
          unitCodeLine.set('submitted', false);
        }

        if (!unitCodeLine.get('codeLine')) {
          newCodeLineId = unitCodeLine.get('id');
        }
      });

      if (newCodeLineId) {
        this._deleteCodeLine(codeLinesProp, newCodeLineId);
      }

      // send updated code lines array up to stylesheet
      this.attrs['update-code-lines'](this.get(codeLinesProp));
    },

    submitCodeLine(codeStr, unitType, id) {
      const codeLinesProp = unitType === 'tower' ?
                                         'twrCodeLines' :
                                         'twrGrpCodeLines';

      let newCodeLineFound = false;

      this.get(codeLinesProp).forEach((unitCodeLine) => {
        if (unitCodeLine.get('id') === id) {
          unitCodeLine.set('codeLine', codeStr);
          unitCodeLine.set('submitted', true);
        }

        if (!unitCodeLine.get('codeLine')) {
          newCodeLineFound = true;
        }
      });

      if (!newCodeLineFound) {
        this.get(codeLinesProp).pushObject(createUnitCodeLine());
      }

      // send updated code lines array up to stylesheet
      this.attrs['update-code-lines'](this.get(codeLinesProp));
    }
  }
});
