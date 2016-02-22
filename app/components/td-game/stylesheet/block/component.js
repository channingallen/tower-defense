import Ember from 'ember';
import createUnitCodeLine from 'tower-defense/utils/create-unit-code-line';

////////////////
//            //
//   Basics   //
//            //
////////////////

const BlockComponent = Ember.Component.extend({
  classNames: ['stylesheet__block'],

  tagName: 'ol'
});

//////////////////////////////
//                          //
//   Code Line Management   //
//                          //
//////////////////////////////

BlockComponent.reopen({
  _deleteCodeLine(id) {
    let index;
    this.get('codeLines').forEach((codeLine) => {
      if (id === codeLine.get('id')) {
        index = this.get('codeLines').indexOf(codeLine);
      }
    });

    this.get('codeLines').removeAt(index);
  },

  codeLines: Ember.computed(
    'attrs.towerGroup.styles.[]',
    'attrs.tower.styles.[]',
    function () {
      return this.attrs.tower ?
             this.attrs.tower.get('styles') :
             this.attrs.towerGroup.get('styles');
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

/////////////////////////
//                     //
//   Wave Initiation   //
//                     //
/////////////////////////

BlockComponent.reopen({
  removeUnsubmittedCodeLines: Ember.observer(
    'attrs.waveStarting',
    function () {
      if (this.attrs.waveStarting) {
        this.get('codeLines').forEach((codeLine) => {
          if (!codeLine.submitted) {
            this._deleteCodeLine(codeLine.get('id'));
          }
        });
      }
    }
  )
});

////////////////////
//                //
//   Auto Focus   //
//                //
////////////////////

BlockComponent.reopen({
  inputIdSelectedManually: null,

  inputIdToFocus: null,

  _getUnsubmittedId() {
    let unsubmittedId;

    this.get('codeLines').forEach((codeLine) => {
      if (!codeLine.submitted) {
        unsubmittedId = codeLine.get('id');
      }
    });

    return unsubmittedId;
  },

  _ensureUnsubmittedCodeLinesExist: Ember.observer(
    'codeLines.@each.submitted',
    function () {
      if (this.attrs.waveStarting) {
        return;
      }

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

  actions: {
    disableAutoFocus(id) {
      this.set('inputIdSelectedManually', id);
    },

    enableAutoFocus() {
      this.set('inputIdSelectedManually', null);
    }
  }
});

/////////////////////////
//                     //
//   Input Reporting   //
//                     //
/////////////////////////

BlockComponent.reopen({
  finalInputFound: false,

  actions: {
    notifyFinalInput() {
      this.set('finalInputFound', true);
    }
  }
});

export default BlockComponent;
