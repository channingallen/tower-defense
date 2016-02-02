import Ember from 'ember';
import { mobDimensions } from 'tower-defense/objects/mob';

////////////////
//            //
//   Basics   //
//            //
////////////////

const MobComponent = Ember.Component.extend({
  classNames: ['mob'],

  endPointReached: false,

  healthBarClass: 'mob__health-bar--100',

  pathCoordsIndex: 0,

  nextPathCoordsIndex: 1,

  _destroyMob() {
    this.attrs['destroy-mob'](this.attrs.mob);
  },

  _getNumFromPx(pixels) {
    const valWithoutPx = pixels.split('px')[0];
    return parseInt(valWithoutPx, 10);
  },

  _getPercentageLeft(leftPxStr) {
    const leftPx = this._getNumFromPx(leftPxStr);
    const boardWidthPx = this.$().parent().width();
    return (leftPx / boardWidthPx) * 100;
  },

  _getPercentageTop(topPxStr) {
    const topPx = this._getNumFromPx(topPxStr);
    const boardHeightPx = this.$().parent().height();
    return (topPx / boardHeightPx) * 100;
  },

  _getTransitionSecs(nextMobLeftPct, nextMobTopPct) {
    const mobLeftPxStr = this.$().css('left');
    const mobTopPxStr = this.$().css('top');
    if (mobLeftPxStr === 'auto' || mobTopPxStr === 'auto') {
      return 0;
    }

    const currentMobLeftPct = this._getPercentageLeft(mobLeftPxStr);
    const currentMobTopPct = this._getPercentageTop(mobTopPxStr);

    const pctDiff = Math.abs(currentMobLeftPct - nextMobLeftPct) +
                    Math.abs(currentMobTopPct - nextMobTopPct);

    return this.attrs.speed * (pctDiff / 100);
  },

  _updatePosition() {
    const mobRadiusPct = mobDimensions / 2;

    const mobLeftPx = this.$().css('left');
    const mobLeftPct = this._getPercentageLeft(mobLeftPx);
    const pathLeftPct = mobLeftPct + mobRadiusPct;

    const mobTopPx = this.$().css('top');
    const mobTopPct = this._getPercentageTop(mobTopPx);
    const pathTopPct = mobTopPct + mobRadiusPct;

    // TODO: Will one of these ever be truthy without the other? Or either?
    //       Not sure how this could occur.
    if (mobLeftPct && mobTopPct) {
      const mobId = this.attrs.mob.get('id');
      // TODO: just send up the action ONCE with both X and Y data in it
      this.attrs['update-position'](mobId, 'X', pathLeftPct);
      this.attrs['update-position'](mobId, 'Y', pathTopPct);
    }

    Ember.run.later(this, () => {
      if (!this.get('isDestroying') && !this.get('endPointReached')) {
        this._updatePosition();
      }
    }, 20);
  },

  numPathObjects: Ember.computed('attrs.path.[]', function () {
    return this.attrs.path.length;
  }),

  _checkMobStatus: Ember.observer('attrs.health', 'endPointReached', function () {
    if (this.attrs.health < 1) {
      this.attrs['add-points'](this.attrs.mob.get('points'));

      this._destroyMob();
    } else if (this.get('endPointReached')) {
      this.attrs['subtract-points'](this.attrs.mob.get('points'));

      this._destroyMob();
    }
  }),

  _setMobDimensions: Ember.on('didInsertElement', function () {
    this.$().css('width', `${mobDimensions}%`);
    this.$().css('height', `${mobDimensions}%`);
  }),

  _updateHealth: Ember.observer('attrs.health', function () {
    const maxHealth = this.attrs.mob.get('maxHealth');
    if (this.attrs.health > Math.floor(maxHealth * 0.80)) {
      this.set('healthBarClass', 'mob__health-bar--100');
    } else if (this.attrs.health > Math.floor(maxHealth * 0.60)) {
      this.set('healthBarClass', 'mob__health-bar--80');
    } else if (this.attrs.health > Math.floor(maxHealth * 0.40)) {
      this.set('healthBarClass', 'mob__health-bar--60');
    } else if (this.attrs.health > Math.floor(maxHealth * 0.20)) {
      this.set('healthBarClass', 'mob__health-bar--40');
    } else {
      this.set('healthBarClass', 'mob__health-bar--20');
    }
  }),

  _updateIdSelector: Ember.on('didInsertElement', function () {
    this.$().attr('id', this.attrs.mob.get('id'));
  })
});

//////////////////
//              //
//   Movement   //
//              //
//////////////////

MobComponent.reopen({
  // Mob coordinates (which represent the top left of the mob) should always be
  // a little bit above and to the left of path coordinates, so that the CENTER
  // of the mob matches the path coordinates.
  _getMobCoordsFromPathCoords(pathCoords) {
    const mobRadiusPct = mobDimensions / 2;
    const mobLeftCoordPct = pathCoords.get('x') - mobRadiusPct;
    const mobTopCoordPct = pathCoords.get('y') - mobRadiusPct;
    return { mobXPct: mobLeftCoordPct, mobYPct: mobTopCoordPct };
  },

  _moveMobAlongPath() {
    const nextPathCoordsIndex = this.get('nextPathCoordsIndex');
    this.set('pathCoordsIndex', nextPathCoordsIndex);
    this.incrementProperty('nextPathCoordsIndex');

    const path = this.attrs.path;
    const nextPathCoords = path.objectAt(nextPathCoordsIndex);
    const { mobXPct, mobYPct } = this._getMobCoordsFromPathCoords(nextPathCoords);
    const transitionSecs = this._getTransitionSecs(mobXPct, mobYPct);
    this._moveMobToCoordinates(mobXPct, mobYPct, transitionSecs);

    Ember.run.later(this, () => {
      if (this.get('isDestroying')) {
        return;
      }

      const pathLastIndex = path.get('length') - 1;
      const morePathCoordsExist = pathLastIndex >= nextPathCoordsIndex + 1;
      if (morePathCoordsExist) {
        this._moveMobAlongPath();
      } else {
        this.set('endPointReached', true);
      }
    }, transitionSecs * 1000);
  },

  _moveMobToCoordinates(mobXPct, mobYPct, secs = 0) {
    this.$().css('transition', `all ${secs}s linear`);
    this.$().css('left', `${mobXPct}%`);
    this.$().css('top', `${mobYPct}%`);
  },

  _placeMobAtStart() {
    const startingPathCoords = this.attrs.path.objectAt(0);
    const { mobXPct, mobYPct } = this._getMobCoordsFromPathCoords(startingPathCoords);
    this._moveMobToCoordinates(mobXPct, mobYPct);
  },

  _kickOffMovement: Ember.on('didInsertElement', function () {
    Ember.run.schedule('afterRender', this, () => {
      this._placeMobAtStart();
      this._moveMobAlongPath();
      this._updatePosition();
    });
  })
});

export default MobComponent;
