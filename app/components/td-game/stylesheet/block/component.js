import Ember from 'ember';
import createUnitCodeLine from 'tower-defense/utils/create-unit-code-line';

export default Ember.Component.extend({
  classNames: ['stylesheet__block'],

  tagName: 'ol',

  // TODO THIS COMMIT: is this called?
  _copyStyles(unit) { // unit === 'towerGroup' || unit === 'tower'
    const unitStyles = Ember.A([]);

    this.attrs[unit].get('styles').forEach(function (styleObj) {
      let unitStyle = Ember.Object.create({});

      for (var prop in styleObj) {
        switch (prop) {
          case 'codeLine':
            unitStyle.set('codeLine', styleObj.prop);
            break;
          case 'submitted':
            unitStyle.set('submitted', styleObj.prop);
            break;
          case 'id':
            unitStyle.set('id', styleObj.prop);
            break;
          default:
            break;
        }
      }

      unitStyles.pushObject(unitStyle);
    });

    return unitStyles;
  },

  _deleteCodeLine(/*id*/) {
    // if (this._unsubmittedCodeLineFound(this.get('codeLines'))) {
    //   this.get('codeLines').forEach((codeLine) => {
    //     if (codeLine.get('id') === id) {
    //       codeLine.destroy();
    //     }
    //   });
    // } else {
    //   this.get('codeLines').forEach((codeLine) => {
    //     if (codeLine.get('id') === id) {
    //       codeLine.set('submitted', false);
    //       codeLine.set('codeLine', null);
    //     }
    //   });
    // }
  },

  _unsubmittedCodeLineFound(codeLines) {
    let unsubmittedCodeLineFound = false;

    if (!codeLines) {
      unsubmittedCodeLineFound = true;
    }
    codeLines.forEach((codeLine) => {
      if (!codeLine.get('submitted')) {
        unsubmittedCodeLineFound = true;
      }
    });

    return unsubmittedCodeLineFound;
  },

  codeLines: Ember.computed(
    'attrs.tower.styles.@each.codeLine',
    'attrs.towerGroup.styles.@each.codeLine',
    function () {
      const codeLines = this.attrs.tower ?
                        this.attrs.tower.get('styles') :
                        this.attrs.towerGroup.get('styles');

      if (!this._unsubmittedCodeLineFound(codeLines)) {
        codeLines.pushObject(createUnitCodeLine());
      }

      return codeLines;
    }
  ),

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
    deleteCodeLine(id) {
      this._deleteCodeLine(id);

      this.attrs['update-unit-styles'](this.get('codeLines'));
    },

    submitCodeLine(codeStr, id) {
      this.get('codeLines').forEach((unitCodeLine) => {
        if (unitCodeLine.get('id') === id) {
          unitCodeLine.set('codeLine', codeStr);
          unitCodeLine.set('submitted', true);
        }
      });

      this.attrs['update-unit-styles'](this.get('codeLines'));
    }
  }
});
