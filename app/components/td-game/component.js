import Ember from 'ember';
import createWave from 'tower-defense/utils/create-wave';

export default Ember.Component.extend({
  classNames: ['td-game'],

  currentWave: createWave(),

  selectedTower: null,

  selectedTowerGroup: null,

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
  twrCodeLines: null,

  twrGrpCodeLines: null,

  waveStarted: false,

  actions: {
    selectTower(tower) {
      if (this.get('selectedTowerGroup')) {
        this.forceSet('selectedTowerGroup', null);
      }

      this.forceSet('selectedTower', tower);
    },

    selectTowerGroup(towerGroup) {
      if (this.get('selectedTower')) {
        this.forceSet('selectedTower', null);
      }

      this.forceSet('selectedTowerGroup', towerGroup);
    },

    setStyles(twrGrpCodeLines, twrCodeLines) {
      this.set('twrGrpCodeLines', twrGrpCodeLines);
      this.set('twrCodeLines', twrCodeLines);

      console.log(''); // TODO THIS COMMIT: remove this
      console.log('---'); // TODO THIS COMMIT: remove this
      console.log('td-game/component.js:'); // TODO THIS COMMIT: remove this
      if (this.get('twrGrpCodeLines')) {
        this.get('twrGrpCodeLines').forEach((codeLine) => {
          console.log('codeLine.get(\'codeLine\'): ', codeLine.get('codeLine')); // TODO THIS COMMIT: remove this
        });
      }

      console.log(''); // TODO THIS COMMIT: remove this
      console.log('---'); // TODO THIS COMMIT: remove this
      console.log('td-game/component.js:'); // TODO THIS COMMIT: remove this
      if (this.get('twrCodeLines')) {
        this.get('twrCodeLines').forEach((codeLine) => {
          console.log('codeLine.get(\'codeLine\'): ', codeLine.get('codeLine')); // TODO THIS COMMIT: remove this
        });
      }
    },

    startWave() {
      this.set('waveStarted', true);
    }
  }
});
