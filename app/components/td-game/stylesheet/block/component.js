import Ember from 'ember';
import createUnitCodeLine from 'tower-defense/utils/create-unit-code-line';

export default Ember.Component.extend({
  classNames: ['stylesheet__block'],

  tagName: 'ol',

  codeLines: Ember.computed(
    'attrs.tower',
    'attrs.towerGroup',
    function () {
      return this._copyStyles(this.attrs.tower ? 'tower' : 'towerGroup');
    }
  ),

  _copyStyles(unit) { // unit === 'towerGroup' || unit === 'tower'
    const unitStyles = Ember.A([]);

    this.attrs[unit].get('styles').forEach(function (styleObj) {
      let unitStyle = Ember.Object.extend({});

      for (var prop in styleObj) {
        switch (prop) {
          case 'codeLine':
            unitStyle.codeLine = styleObj.prop;
            break;
          case 'submitted':
            unitStyle.submitted = styleObj.prop;
            break;
          case 'id':
            unitStyle.id = styleObj.prop;
            break;
          default:
            break;
        }
      }

      unitStyles.pushObject(unitStyle.create());
    });

    return unitStyles;
  },

  _deleteCodeLine(id) {
    const newCodeLines = this.get('codeLines').filter((unitCodeLine) => {
      return unitCodeLine.get('id') === id ? false : true;
    });

    this.set('codeLines', newCodeLines);
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
      this._deleteCodeLine(id);

      this.attrs['update-unit-styles'](this.get('codeLines'));
    },

    editCodeLine(unitType, id) {
      let newCodeLineId;

      this.get('codeLines').forEach((unitCodeLine) => {
        if (unitCodeLine.get('id') === id) {
          unitCodeLine.set('submitted', false);
        }

        if (!unitCodeLine.get('codeLine')) {
          newCodeLineId = unitCodeLine.get('id');
        }
      });

      if (newCodeLineId) {
        this._deleteCodeLine(newCodeLineId);
      }

      this.attrs['update-unit-styles'](this.get('codeLines'));
    },

    submitCodeLine(codeStr, unitType, id) {
      let newCodeLineFound = false;

      this.get('codeLines').forEach((unitCodeLine) => {
        if (unitCodeLine.get('id') === id) {
          unitCodeLine.set('codeLine', codeStr);
          unitCodeLine.set('submitted', true);
        }

        if (!unitCodeLine.get('codeLine')) {
          newCodeLineFound = true;
        }
      });

      if (!newCodeLineFound) {
        this.get('codeLines').pushObject(createUnitCodeLine());
      }

      this.attrs['update-unit-styles'](unitType, this.get('codeLines'));
    }
  }
});
