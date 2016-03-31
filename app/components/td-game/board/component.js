import Ember from 'ember';

/**
 * Basics
 * Sound Effects
 * Mob Basics
 * Mob Generation
 * Mob Modification
 * Wave Scoring
 * Reset
 */

////////////////
//            //
//   Basics   //
//            //
////////////////

const BoardComponent = Ember.Component.extend({
  classNames: ['td-game__board'],

  waveCancelled: false,

  _applyBackgroundImage: Ember.on('didInsertElement', Ember.observer(
    'attrs.backgroundImage',
    function () {
      this.$().css('background-image', `url(${this.attrs.backgroundImage})`);
    }
  ))
});

///////////////////////
//                   //
//   Sound Effects   //
//                   //
///////////////////////

BoardComponent.reopen({
  volumeSettings: ['volume-up', 'volume-down', 'volume-off'],

  volumeKey: 0,

  volume: Ember.computed('volumeKey', function () {
    const volumeKey = this.get('volumeKey');
    return this.get('volumeSettings').objectAt(`${volumeKey}`);
  }),

  actions: {
    toggleVolume() {
      if (this.get('volumeKey') < 2) {
        this.incrementProperty('volumeKey');
      } else {
        this.set('volumeKey', 0);
      }
    }
  }
});

////////////////////
//                //
//   Mob Basics   //
//                //
////////////////////

BoardComponent.reopen({
  mobIndex: 0,

  mobs: []
});

////////////////////////
//                    //
//   Mob Generation   //
//                    //
////////////////////////

BoardComponent.reopen({
  numMobsTerminated: 0,

  _generateMobs() {
    if (this.get('waveCancelled')) {
      this.set('waveCancelled', false);
      return;
    }

    const mobIndex = this.get('mobIndex');
    const currentMob = this.attrs.waveMobs.objectAt(mobIndex);
    this.get('mobs').addObject(currentMob);

    const anotherMobExists = !!this.attrs.waveMobs.objectAt(mobIndex + 1);
    if (anotherMobExists) {
      this.incrementProperty('mobIndex');

      const mobFrequency = currentMob.get('frequency');
      Ember.run.later(this, () => {
        if (this.get('waveCancelled')) {
          this.set('waveCancelled', false);
          return;
        }

        this._generateMobs();
      }, mobFrequency);
    }
  },

  mobFrequency: Ember.computed('mobIndex', function () {
    const mobIndex = this.get('mobIndex');
    const waveMob = this.attrs.waveMobs[mobIndex];
    return waveMob.get('frequency');
  }),

  numMobsToTerminate: Ember.computed('attrs.waveStarted', function () {
    const firstMob = this.attrs.waveMobs.objectAt(0);
    const firstMobExists = !!firstMob;
    if (firstMobExists) {
      return firstMob.get('quantity');
    } else {
      return 5;
    }
  }),

  _kickOffMobGeneration: Ember.observer('attrs.waveStarted', function () {
    if (!this.attrs.waveStarted) {
      this.set('mobIndex', 0);
      this.set('mobs', []);

      if (this.get('waveCancelled')) {
        this.set('waveCancelled', false);
      }

      return;
    }

    this.set('numMobsTerminated', 0);
    this._generateMobs();
  })
});

//////////////////////////
//                      //
//   Mob Modification   //
//                      //
//////////////////////////

BoardComponent.reopen({
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

  _resetMobs: Ember.observer('attrs.cancellingWave', function () {
    if (this.attrs.cancellingWave) {
      this.set('waveCancelled', true);
      return;
    }
  }),

  actions: {
    damageMob(mobId, attackPower) {
      this._reduceMobHealth(mobId, attackPower);
    },

    destroyMob(mob) {
      const mobIndex = this.get('mobs').indexOf(mob);
      this.get('mobs').removeAt(mobIndex);
      this.incrementProperty('numMobsTerminated');

      mob.set('active', false);
    },

    reportMobPosition(mobId, axis, pos) {
      this.get('mobs').forEach((mob) => {
        if (mobId === mob.get('id')) {
          mob.set('pos' + axis, pos);
        }
      });
    },

    updateMobClass(mobId, newClass) {
      this.get('mobs').forEach((mob) => {
        if (mobId === mob.get('id')) {
          mob.set('posClass', newClass);
        }
      });
    }
  }
});

//////////////////////
//                  //
//   Wave Scoring   //
//                  //
//////////////////////

BoardComponent.reopen({
  wavePoints: 0,

  _getFinalScore: Ember.observer(
    'numMobsTerminated',
    function () {
      if (this.get('numMobsTerminated') >= this.get('numMobsToTerminate')) {
        this.attrs['score-wave'](this.get('wavePoints'));
      }
    }
  ),

  actions: {
    addPoints(points) {
      const currentWavePoints = this.get('wavePoints');

      if (currentWavePoints + points >= 100) {
        this.set('wavePoints', 100);
      } else {
        this.set('wavePoints', currentWavePoints + points);
      }
    }
  }
});

// TODO: is this reset code necessary?

///////////////
//           //
//   Reset   //
//           //
///////////////

BoardComponent.reopen({
  _resetBoard: Ember.observer('attrs.waveStarted', function () {
    if (!this.attrs.waveStarted) {
      this.set('wavePoints', 0);
    }
  })
});

export default BoardComponent;
