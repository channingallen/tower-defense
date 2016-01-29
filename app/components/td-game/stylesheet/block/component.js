import Ember from 'ember';
import createUnitCodeLine from 'tower-defense/utils/create-unit-code-line';

export default Ember.Component.extend({
  classNames: ['stylesheet__block'],

  finalInputFound: false,

  inputIdSelectedManually: null,

  inputIdToFocus: null,

  tagName: 'ol',

  _deleteCodeLine(id) {
    let index;
    this.get('codeLines').forEach((codeLine) => {
      if (id === codeLine.get('id')) {
        index = this.get('codeLines').indexOf(codeLine);
      }
    });

    this.get('codeLines').removeAt(index);
  },

  _getUnsubmittedId() {
    let unsubmittedId;

    this.get('codeLines').forEach((codeLine) => {
      if (!codeLine.submitted) {
        unsubmittedId = codeLine.get('id');
      }
    });

    return unsubmittedId;
  },

  // TODO THIS COMMIT: refine observed values
  codeLines: Ember.computed(
    'attrs.towerGroup.styles.[]',
    'attrs.tower.styles.[]',
    // 'attrs.towerGroup.styles.@each.submitted',
    // 'attrs.tower.styles.@each.submitted',
    function () {
      return this.attrs.tower ?
             this.attrs.tower.get('styles') :
             this.attrs.towerGroup.get('styles');
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

  _ensureUnsubmittedCodeLinesExist: Ember.observer(
    'codeLines.@each.submitted',
    function () {
      const codeLines = this.get('codeLines');
      if (codeLines.isEvery('submitted')) {
        codeLines.pushObject(createUnitCodeLine());
      }
    }
  ),

  _focusProperInput: Ember.observer(
    'attrs.selectedTower',
    'attrs.selectedTowerGroup',
    'attrs.tower',
    'attrs.towerGroup',
    function () {
      const waveStarted = this.attrs.waveStarted;
      if (waveStarted) {
        return;
      }

      const towerSelected = this.attrs.selectedTower &&
        this.attrs.selectedTower === this.attrs.tower;

      const towerGroupSelected = this.attrs.selectedTowerGroup &&
        this.attrs.selectedTowerGroup === this.attrs.towerGroup;

      if (towerSelected || towerGroupSelected) {
        const inputAutoSelected = !this.get('inputIdSelectedManually');
        if (inputAutoSelected) {
          const unsubmittedInputId = this._getUnsubmittedId();
          this.forceSet('inputIdToFocus', unsubmittedInputId);
        } else {
          this.forceSet('inputIdToFocus', this.get('inputIdSelectedManually'));
        }
      }
    }
  ),

  _resetBlock: Ember.observer('attrs.waveStarted', function () {
    if (!this.attrs.waveStarted) {
      this.set('finalInputFound', false);
      this.set('inputIdSelectedManually', null);
      this.set('inputIdToFocus', null);
    }
  }),

  actions: {
    deleteCodeLine(id) {
      this._deleteCodeLine(id);

      this.attrs['update-unit-styles'](this.get('codeLines'));
    },

    disableAutoFocus(id) {
      this.set('inputIdSelectedManually', id);
    },

    enableAutoFocus() {
      this.set('inputIdSelectedManually', null);
    },

    notifyFinalInput() {
      this.set('finalInputFound', true);
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
