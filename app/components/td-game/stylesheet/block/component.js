import Ember from 'ember';
import createUnitCodeLine from 'tower-defense/utils/create-unit-code-line';

/**
 * Basics
 * Code Line Management
 * Wave Initiation
 * Auto Focus
 */

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
    const codeLines = this.get('codeLines');
    const codeLine = this._getCodeLineById(id);

    if (codeLine.get('codeLine') || this.attrs.waveStarting || this._otherUnsubmittedCodeLinesExist(id)) {
      const index = codeLines.indexOf(codeLine);
      codeLines.removeAt(index);
    }
  },

  _getCodeLineById(id) {
    const codeLines = this.get('codeLines');
    let targetCodeLine;
    codeLines.forEach((codeLine) => {
      if (id === codeLine.get('id')) {
        targetCodeLine = codeLine;
      }
    });

    return targetCodeLine;
  },

  _otherUnsubmittedCodeLinesExist(id) {
    const codeLines = this.get('codeLines');
    let otherUnsubmittedCodeLinesExist = false;
    codeLines.forEach((codeLine) => {
      if (id !== codeLine.get('id')) {
        if (!codeLine.get('submitted')) {
          otherUnsubmittedCodeLinesExist = true;
        }
      }
    });

    return otherUnsubmittedCodeLinesExist;
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
    },

    submitCodeLine(codeStr, id, valid) {
      this.get('codeLines').forEach((unitCodeLine) => {
        if (unitCodeLine.get('id') === id) {
          unitCodeLine.set('valid', valid);
          unitCodeLine.set('codeLine', codeStr);
          unitCodeLine.set('submitted', true);
        }
      });
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
        codeLines.addObject(createUnitCodeLine());

        Ember.run.schedule('afterRender', this, () => {
          this.set('inputIdSelectedManually', null);
          this._focusProperInput(); // TODO THIS COMMIT: confirm this works
        });
      }
    }
  ),

  // Two separate processes invoke this autofocusing function:
  // 1. The tower or group containing this block is selected and the watched
  //    objects change.
  // 2. A codeline submission from *within* this block triggers a new input to
  //    be created, and this function is called *explicitly*. For an example
  //    see the final lines of _ensureUnsubmittedCodeLinesExist above.
  _focusProperInput: Ember.observer(
    'attrs.selectedTower',
    'attrs.selectedTowerGroup',
    'attrs.tower',
    'attrs.towerGroup',
    function () {
      if (this.attrs.waveStarted) {
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

export default BlockComponent;
