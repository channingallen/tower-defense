import Ember from 'ember';
import createWave from 'tower-defense/utils/create-wave';

export default Ember.Component.extend({
  classNames: ['td-game'],

  // wave (default):
  // {
  //   board: {
  //     imageUrl: null,
  //     pathData: null
  //   },
  //   minimumScore: 3,
  //   mobs: [
  //     mob: {
  //       maxHealth: 100,
  //       points: 1,
  //       quantity: 10,
  //       speed: 1,
  //       type: 'standard'
  //     }
  //   ],
  //   towerGroups: [
  //     towerGroup: {
  //       selector: '.tower-group',
  //       styles: [
  //         {
  //           codeLine: undefined,
  //           submitted: false,
  //           id: null,
  //           unitType: null
  //         }
  //       ],
  //       towers: [
  //         tower: {
  //           selector: '.tower',
  //           styles: [
  //             {
  //               codeLine: undefined,
  //               submitted: false,
  //               id: null,
  //               unitType: null
  //             }
  //           ],
  //           type: 1
  //         }
  //       ]
  //     }
  //   ]
  // }
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
  twrStyles: null,

  twrGrpStyles: null,

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

    setStyles(twrGrpStyles, twrStyles) {
      let currentTowerGroup;
      this.get('currentWave.towerGroups').forEach((towerGroup) => {
        if (towerGroup === this.get('selectedTowerGroup')) {
          currentTowerGroup = towerGroup;

          if (twrGrpStyles) {
            towerGroup.forceSet('styles', twrGrpStyles);
          }
        }
      });

      currentTowerGroup.towers.forEach((tower) => {
        if (tower === this.get('selectedTower')) {
          if (twrStyles) {
            tower.forceSet('styles', twrStyles);
          }
        }
      });

      // TODO: potentially you will then need to update the selectedUnit prop
      //       - if that isn't "watching" the original unit prop, whose styles
      //       - array has been updated
    },

    startWave() {
      this.set('waveStarted', true);
    }
  }
});
