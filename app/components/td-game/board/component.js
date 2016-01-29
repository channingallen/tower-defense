import Ember from 'ember';
import Projectile from 'tower-defense/objects/projectile';

export default Ember.Component.extend({
  classNames: ['td-game__board'],

  mobIndex: 0,

  mobs: Ember.ArrayProxy.create({ content: Ember.A([]) }),

  projectiles: Ember.ArrayProxy.create({ content: Ember.A([]) }),

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

  _generateMob() {
    const mobIndex = this.get('mobIndex');
    const waveMob = this.attrs.waveMobs[mobIndex];
    this.get('mobs').pushObject(waveMob);

    const nextMobIndex = mobIndex + 1;
    this.set('mobIndex', nextMobIndex);
  },

  _getMobById(mobId) {
    let needle;
    this.get('mobs').forEach((mob) => {
      if (mob.get('id') === mobId) {
        needle = mob;
      }
    });
    return needle;
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

  _getTowerById(towerId) {
    let needle;
    this.get('towers').forEach((tower) => {
      if (tower.get('id') === towerId) {
        needle = tower;
      }
    });
    return needle;
  },

  _mobCapacityReached() {
    return this.get('mobIndex') < this.attrs.waveMobs.length ? false : true;
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

  mobFrequency: Ember.computed('mobIndex', function () {
    const mobIndex = this.get('mobIndex');
    const waveMob = this.attrs.waveMobs[mobIndex];
    return waveMob.get('frequency');
  }),


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

  towerGroupTowers: Ember.computed.mapBy('attrs.towerGroups', 'towers'),

  _applyBackgroundImage: Ember.on('didInsertElement', Ember.observer('attrs.backgroundImage', function () {
    this.$().css('background-image', `url(${this.attrs.backgroundImage})`);
  })),

  _attackMobsInTowerRangeOnWaveStart: Ember.observer('attrs.waveStarted', function () {
    Ember.run.later(this, '_attackMobsInTowerRange', 500);
  }),

  _getFinalScore: Ember.observer('mobs.@each.active', function () {
    let waveEnded = true;

    this.get('mobs').forEach((mob) => {
      if (!mob) {
        return;
      }

      if (mob.get('active')) {
        waveEnded = false;
      }
    });

    if (waveEnded) {
      this.attrs['score-wave'](this.get('wavePoints'));
    }
  }),

  _generateMobs: Ember.observer('attrs.waveStarted', function () {
    this._generateMob();

    if (!this._mobCapacityReached()) {
      const produceNextMob = setInterval(() => {
        this._generateMob();

        if (this._mobCapacityReached()) {
          clearInterval(produceNextMob);
        }
      }, this.get('mobFrequency'));
    }
  }),

  _resetBoard: Ember.observer('attrs.waveStarted', function () {
    if (!this.attrs.waveStarted) {
      this.set('mobIndex', 0);
      this.set('mobs', Ember.ArrayProxy.create({ content: Ember.A([]) }));
      this.set('projectiles', Ember.ArrayProxy.create({ content: Ember.A([]) }));
      this.set('towers', Ember.ArrayProxy.create({ content: Ember.A([]) }));
      this.set('wavePoints', 0);
    }
  }),

  actions: {
    addPoints(points) {
      const currentWavePoints = this.get('wavePoints');
      this.set('wavePoints', currentWavePoints + points);
    },

    damageMob(mobId, towerId) {
      const tower = this._getTowerById(towerId);

      this._reduceMobHealth(mobId, tower.get('attackPower'));
    },

    destroyMob(mob) {
      const mobIndex = this.get('mobs').indexOf(mob);
      this.get('mobs').removeAt(mobIndex);

      mob.set('active', false);
    },

    destroyProjectile(projectileId) {
      const projectile = this._getProjectileById(projectileId);
      const projectileFound = !!projectile;
      const projectilesFound = this.get('projectiles.length');
      if (projectileFound && projectilesFound) {
        console.log(`BOARD destroyProjectile ${projectileId}`); // TODO THIS COMMIT: remove this
        const projectileIndex = this.get('projectiles').indexOf(projectile);
        this.get('projectiles').removeAt(projectileIndex);
      }
    },

    subtractPoints(points) {
      const currentWavePoints = this.get('wavePoints');

      if ((currentWavePoints - points) >= 0) {
        this.set('wavePoints', currentWavePoints - points);
      } else {
        this.set('wavePoints', 0);
      }
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
