import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['positionRelative:td-game__board--relative'],

  classNames: ['td-game__board'],

  mobIndex: 0,

  mobs: Ember.ArrayProxy.create({ content: Ember.A([]) }),

  numMobsGenerated: 1,

  positionRelative: false,

  towerGroups: Ember.A([]),

  towers: Ember.ArrayProxy.create({ content: Ember.A([]) }),

  _mobCapacityReached() {
    return this.get('mobIndex') < this.attrs.waveMobs.length ? false : true;
  },

  _mobInRangeOfTower(mob, tower, range) {
    function getDistance(mob, tower) {
      var latDiff = Math.abs(tower.get('posX') - mob.get('posX'));
      var lngDiff = Math.abs(tower.get('posY') - mob.get('posY'));
      return latDiff + lngDiff;
    }

    return getDistance(mob, tower) < range ? true : false;
  },

  _reduceMobHealth(mobId, healthToReduce) {
    if (!healthToReduce) {
      healthToReduce = 20;
    }

    this.get('mobs').forEach((mob) => {
      if (mobId === mob.get('id')) {
        const currentHealth = mob.get('health');
        mob.set('health', currentHealth - healthToReduce);
      }
    });
  },

  attackMobsInTowerRange: Ember.observer('attrs.waveStarted', function () {
    setInterval(() => {
      if (!this.get('towers.length') || !this.get('mobs.length')) {
        return;
      }

      this.get('towers').forEach((tower) => {
        this.get('mobs').forEach((mob) => {
          if (this._mobInRangeOfTower(mob, tower, 100)) { // TODO: replace arg 3 with tower property for attack range, based on type?
            this._reduceMobHealth(mob.get('id'), 20); // TODO: replace arg 2 with tower property for attack power, based on type?
          }
        });
      });
    }, 500);
  }),

  generateMobs: Ember.observer('attrs.waveStarted', function () {
    const produceMob = setInterval(() => {
      const mobIndex = this.get('mobIndex');
      const waveMob = this.attrs.waveMobs[mobIndex];
      this.get('mobs').pushObject(waveMob);

      const nextMobIndex = mobIndex + 1;
      this.set('mobIndex', nextMobIndex);

      if (this._mobCapacityReached()) {
        clearInterval(produceMob);
      }
    }, 5000);
  }),

  getTowers: Ember.observer('attrs.waveStarted', function () {
    this.attrs.towerGroups.forEach((towerGroup) => {
      this.get('towers').pushObject(towerGroup);

      towerGroup.get('towers').forEach((tower) => {
        this.get('towers').pushObject(tower);
      });
    });
  }),

  repositionBoard: Ember.observer('attrs.waveStarted', function () {
    this.set('positionRelative', true);
  }),

  actions: {
    updateMobClass(mobId, newClass) {
      this.get('mobs').forEach((mob) => {
        if (mobId === mob.get('id')) {
          mob.set('posClass', newClass);
        }
      });
    },

    updateMobPosition(mobId, axis, pos) {
      this.get('mobs').forEach((mob) => {
        if (mobId === mob.get('id')) {
          mob.set('pos' + axis, pos);
        }
      });
    },

    updateTowerPosition(id, axis, pos) {
      axis = axis.toUpperCase();

      this.get('towers').forEach((tower) => {
        if (tower.get('id') === id) {
          tower.set('pos' + axis, pos);
        }
      });
    }
  }
});
