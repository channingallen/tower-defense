import Ember from 'ember';
import Projectile from 'tower-defense/objects/projectile';

////////////////
//            //
//   Basics   //
//            //
////////////////

const BoardComponent = Ember.Component.extend({
  classNames: ['td-game__board'],

  _applyBackgroundImage: Ember.on('didInsertElement', Ember.observer(
    'attrs.backgroundImage',
    function () {
      this.$().css('background-image', `url(${this.attrs.backgroundImage})`);
    }
  ))
});

/////////////////////////////////
//                             //
//   Tower Targeting of Mobs   //
//                             //
/////////////////////////////////

BoardComponent.reopen({
  _attackMobsInTowerRange() {
    if (!this.attrs.waveStarted ||
        !this.get('towers.length') ||
        !this.get('mobs.length')) {
      return;
    }

    this.get('towers').forEach((tower) => {
      const towerId = tower.get('id');
      const range = tower.get('attackRange');
      let towerHasShot = false;

      this.get('mobs').forEach((mob) => {
        if (this._mobInRangeOfTower(mob, tower, range) &&
            mob.get('health') > 0 &&
            !towerHasShot) {
          towerHasShot = true;

          const mobId = mob.get('id');
          this._buildProjectile(towerId, mobId);
        }
      });
    });

    Ember.run.later(this, '_attackMobsInTowerRange', 500);
  },

  _mobInRangeOfTower(mob, tower, range) {
    if (!mob || !tower) {
      return false;
    }

    function getDistance(mob, tower) {
      var latDiff = Math.abs(tower.get('posX') - mob.get('posX'));
      var lngDiff = Math.abs(tower.get('posY') - mob.get('posY'));
      return latDiff + lngDiff;
    }

    return getDistance(mob, tower) < range ? true : false;
  },

  _attackMobsInTowerRangeOnWaveStart: Ember.observer('attrs.waveStarted', function () {
    Ember.run.later(this, '_attackMobsInTowerRange', 500);
  })
});

////////////////////
//                //
//   Mob Basics   //
//                //
////////////////////

BoardComponent.reopen({
  mobIndex: 0,

  mobs: [],

  _getMobById(mobId) {
    let needle;
    this.get('mobs').forEach((mob) => {
      if (mob.get('id') === mobId) {
        needle = mob;
      }
    });
    return needle;
  }
});

////////////////////////
//                    //
//   Mob Generation   //
//                    //
////////////////////////

BoardComponent.reopen({
  _generateMobs() {
    const mobIndex = this.get('mobIndex');
    const currentMob = this.attrs.waveMobs.objectAt(mobIndex);
    this.get('mobs').pushObject(currentMob);

    const anotherMobExists = !!this.attrs.waveMobs.objectAt(mobIndex + 1);
    if (anotherMobExists) {
      this.incrementProperty('mobIndex');

      const mobFrequency = currentMob.get('frequency');
      Ember.run.later(this, this._generateMobs, mobFrequency);
    }
  },

  mobFrequency: Ember.computed('mobIndex', function () {
    const mobIndex = this.get('mobIndex');
    const waveMob = this.attrs.waveMobs[mobIndex];
    return waveMob.get('frequency');
  }),

  kickOffMobGeneration: Ember.observer('attrs.waveStarted', function () {
    if (!this.attrs.waveStarted || !this.attrs.waveMobs.get('length')) {
      this.set('mobIndex', 0);
      this.set('mobs', []);
      return;
    }

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

  actions: {
    damageMob(mobId, towerId) {
      const tower = this._getTowerById(towerId);

      this._reduceMobHealth(mobId, tower.get('attackPower'));
    },

    destroyMob(mob) {
      const mobIndex = this.get('mobs').indexOf(mob);
      this.get('mobs').removeAt(mobIndex);

      mob.set('active', false);
    },

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
    }
  }
});

/////////////////////
//                 //
//   Projectiles   //
//                 //
/////////////////////

BoardComponent.reopen({
  projectiles: Ember.A([]),

  _buildProjectile(towerId, mobId) {
    const projectileTower = this._getTowerById(towerId);
    const targetedMob = this._getMobById(mobId);

    if (projectileTower && targetedMob) {
      const newProjectile = Projectile.create({
        id: this._generateIdForProjectile(),
        mobId: mobId,
        mobX: targetedMob.get('posX'),
        mobY: targetedMob.get('posY'),
        towerId: towerId,
        towerX: projectileTower.get('posX'),
        towerY: projectileTower.get('posY')
      });

      this.get('projectiles').pushObject(newProjectile);
    }
  },

  _generateIdForProjectile() {
    function generate4DigitString() {
      const baseInt = Math.floor((1 + Math.random()) * 0x10000);
      return baseInt.toString(16).substring(1);
    }

    return generate4DigitString() + generate4DigitString() + '-' +
           generate4DigitString() + '-' + generate4DigitString() + '-' +
           generate4DigitString() + '-' + generate4DigitString() +
           generate4DigitString() + generate4DigitString();
  },

  _getProjectileById(projectileId) {
    let needle;
    this.get('projectiles').forEach((projectile) => {
      if (projectile.get('id') === projectileId) {
        needle = projectile;
      }
    });
    return needle;
  },

  actions: {
    destroyProjectile(projectileId) {
      const projectile = this._getProjectileById(projectileId);
      const projectileFound = !!projectile;
      const projectilesFound = this.get('projectiles.length');
      if (projectileFound && projectilesFound) {
        const projectileIndex = this.get('projectiles').indexOf(projectile);
        this.get('projectiles').removeAt(projectileIndex);
      }
    },

    updateProjectileTargetCoords(projectileId, mobId) {
      const projectile = this._getProjectileById(projectileId);
      const target = this._getMobById(mobId);

      if (!!projectile && !!target) {
        projectile.set('mobX', target.get('posX'));
        projectile.set('mobY', target.get('posY'));
      } else {
        console.error('Projectile or target not found.');
      }
    }
  }
});

////////////////
//            //
//   Towers   //
//            //
////////////////

BoardComponent.reopen({
  _getTowerById(towerId) {
    let needle;
    this.get('towers').forEach((tower) => {
      if (tower.get('id') === towerId) {
        needle = tower;
      }
    });
    return needle;
  },

  towerGroupTowers: Ember.computed.mapBy('attrs.towerGroups', 'towers'),

  towers: Ember.computed('towerGroupTowers.@each.[]', function () {
    function flatten(arrays) {
      let items = Ember.A([]);

      arrays.forEach((array) => {
        array.forEach((item) => {
          items.addObject(item);
        });
      });

      return items;
    }

    return flatten(this.get('towerGroupTowers'));
  }),

  actions: {
    reportTowerPosition(id, axis, pos) {
      axis = axis.toUpperCase();

      this.get('towers').forEach((tower) => {
        if (tower.get('id') === id) {
          tower.set('pos' + axis, pos);
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

  _addMobPoints(mobId) {
    let pointsToAdd;
    this.get('mobs').forEach((mob) => {
      if (mobId === mob.get('id')) {
        pointsToAdd = mob.get('points');
      }
    });

    const currentWavePoints = this.get('wavePoints');
    this.set('wavePoints', currentWavePoints + pointsToAdd);
  },

  _getFinalScore: Ember.observer('mobs.@each.active', function () {
    if (!this.get('mobs.length')) {
      this.attrs['score-wave'](this.get('wavePoints'));
    }
  }),

  actions: {
    addPoints(points) {
      const currentWavePoints = this.get('wavePoints');
      this.set('wavePoints', currentWavePoints + points);
    },

    subtractPoints(points) {
      const currentWavePoints = this.get('wavePoints');

      if ((currentWavePoints - points) >= 0) {
        this.set('wavePoints', currentWavePoints - points);
      } else {
        this.set('wavePoints', 0);
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
      this.set('projectiles', Ember.A([]));
      this.set('wavePoints', 0);
    }
  })
});

export default BoardComponent;
