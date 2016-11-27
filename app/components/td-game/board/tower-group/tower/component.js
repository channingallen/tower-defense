import Ember from 'ember';
import Projectile from 'tower-defense/objects/projectile';
import { pathWidth } from 'tower-defense/objects/board';
import { towerDimensions } from 'tower-defense/objects/tower';

/**
 * Basics
 * Upgrade Management
 * Tower Selection
 * Code Line Management
 * Position Management
 * Path Collision Detection
 * Sizing
 * Rotation (facing targets)
 * Targeting
 * Projectiles
 */

////////////////
//            //
//   Basics   //
//            //
////////////////

const TowerComponent = Ember.Component.extend({
  classNames: ['tower-group__tower']
});

////////////////////////////
//                        //
//   Upgrade Management   //
//                        //
////////////////////////////

TowerComponent.reopen({
  classNameBindings: ['towerUpgraded:tower-group__tower--upgraded'],

  towerUpgraded: false,

  _applyTowerType: Ember.on('didInsertElement', function () {
    Ember.run.schedule('afterRender', this, () => {
      if (this.attrs.type === 2) {
        this.set('towerUpgraded', true);
      }
    });
  })
});

/////////////////////////
//                     //
//   Tower Selection   //
//                     //
/////////////////////////

TowerComponent.reopen({
  classNameBindings: ['selected:tower-group__tower--selected'],

  selected: Ember.computed(
    'attrs.selectedTower',
    'attrs.tower',
    'attrs.waveStarted',
    function () {
      if (!this.attrs.waveStarted) {
        return this.attrs.selectedTower === this.attrs.tower ? true : false;
      } else {
        return false;
      }
    }
  ),

  _handleClick: Ember.on('click', function () {
    this.attrs.select();
  })
});


//////////////////////////////
//                          //
//   Code Line Management   //
//                          //
//////////////////////////////

TowerComponent.reopen({
  _clearPreviousStyles() {
    this.$().css('align-self', 'initial');
    this.$().css('order', 'initial');
  },

  _getProperty(codeLine) {
    const codeLineLowerCase = codeLine.toLowerCase();
    const colonLocation = codeLineLowerCase.indexOf(':');

    return codeLineLowerCase.substring(0, colonLocation);
  },

  _getValue(codeLine, property) {
    const startIndex = property.length + 1;
    const endIndex = codeLine.length;
    return codeLine.substring(startIndex, endIndex).trim();
  },

  _getValueWithoutSemiColon(val) {
    const lastIndex = val.length - 1;
    if (val[lastIndex] === ';') {
      return val.substring(0, lastIndex);
    }
  },

  _styleFound(styleNeedle) {
    if (!styleNeedle) {
      return;
    }

    let styleApplicable = false;
    styleNeedle = styleNeedle.replace(/ /g,'');
    const towerStyles = this.attrs.tower.get('styles');

    if (towerStyles) {
      towerStyles.forEach((styleHaystack) => {
        if (styleHaystack.get('codeLine')) {
          const styleNoWhitespace = styleHaystack.get('codeLine').replace(/ /g,'');
          styleHaystack.set('codeLine', styleNoWhitespace);

          if (styleHaystack.get('codeLine') === styleNeedle) {
            styleApplicable = true;
          }
        }
      });
    }

    return styleApplicable;
  },

  _updateCodeLines: Ember.observer(
    'attrs.tower.styles',
    'attrs.tower.styles.[]',
    'attrs.tower.styles.length',
    'attrs.tower.styles.@each.codeLine',
    'attrs.tower.styles.@each.submitted',
    function () {
      const styles = this.attrs.tower.get('styles');
      const styleFound = !!styles && styles.get('length') > 0;

      let codeLineEmpty = true;
      if (styleFound) {
        const firstCodeLine = styles.get('firstObject');

        const codeLineLength = firstCodeLine.get('codeLine.length');
        codeLineEmpty = isNaN(codeLineLength) || codeLineLength < 1;
      }

      this._clearPreviousStyles();
      if (!styleFound || codeLineEmpty) {
        this.incrementProperty('positionChangeCount');
        return;
      }

      styles.forEach((style) => {
        const codeLine = style.get('codeLine');

        if (this._styleFound(codeLine)) {
          const property = this._getProperty(codeLine);
          const value = this._getValue(codeLine, property);

          if (property && value && style.get('valid')) {
            const semicolonFound = value[value.length - 1] === ';';

            if (semicolonFound) {
              this.$().css(property, this._getValueWithoutSemiColon(value));
              this.incrementProperty('positionChangeCount');
            } else {
              this.$().css(property, value);
              this.incrementProperty('positionChangeCount');
            }
          }
        }
      });
    }
  )
});

/////////////////////////////
//                         //
//   Position Management   //
//                         //
/////////////////////////////

TowerComponent.reopen({
  // This must be manually incremented each time a tower style is applied (e.g.
  // via this.incrementProperty('positionChangeCount'), as found at the end of
  // this._updateCodeLines() above). Otherwise, centerLeftPct and centerTopPct
  // won't wait for the jQuery positional updates at the end of
  // this._updateCodeLines(), since each of these functions are triggered by
  // many of the same properties.
  positionChangeCount: 0,

  // the % distance the center of the tower is from the left of the board
  centerLeftPct: Ember.computed(
    'attrs.stylesInitialized',
    'attrs.towerGroupStyles.[]',
    'attrs.towerGroupStyles.@each.codeLine',
    'attrs.towerGroupStyles.@each.submitted',
    'attrs.tower.styles.[]',
    'attrs.tower.styles.@each.codeLine',
    'attrs.tower.styles.@each.submitted',
    'elementInserted',
    'positionChangeCount',
    function () {
      if (!this.get('elementInserted')) {
        return null;
      }

      const $board = Ember.$('.td-game__board');
      const boardLeftEdgePxFromPage = $board.offset().left;

      const $tower = this.$();
      const towerLeftEdgePxFromPage = $tower.offset().left;

      const towerLeftEdgePxFromBoard = towerLeftEdgePxFromPage -
                                       boardLeftEdgePxFromPage;
      const towerCenterPxFromBoard = towerLeftEdgePxFromBoard;

      const towerRadiusPct = towerDimensions / 2;
      const boardDimensionsPx = $board.innerHeight(); // height === width
      return Math.floor(100 * (towerCenterPxFromBoard / boardDimensionsPx)) +
             towerRadiusPct;
    }
  ),

  // the % distance the center of the tower is from the top of the board
  centerTopPct: Ember.computed(
    'attrs.stylesInitialized',
    'attrs.towerGroupStyles.[]',
    'attrs.towerGroupStyles.@each.codeLine',
    'attrs.towerGroupStyles.@each.submitted',
    'attrs.tower.styles.[]',
    'attrs.tower.styles.@each.codeLine',
    'attrs.tower.styles.@each.submitted',
    'elementInserted',
    'positionChangeCount',
    function () {
      if (!this.get('elementInserted')) {
        return null;
      }

      const $board = Ember.$('.td-game__board');
      const boardTopEdgePxFromPage = $board.offset().top;

      const $tower = this.$();
      const towerTopEdgePxFromPage = $tower.offset().top;

      const towerTopEdgePxFromBoard = towerTopEdgePxFromPage -
                                     boardTopEdgePxFromPage;
      const towerCenterPxFromBoard = towerTopEdgePxFromBoard;

      const towerRadiusPct = towerDimensions / 2;
      const boardDimensionsPx = $board.innerHeight(); // height === width
      return Math.floor(100 * (towerCenterPxFromBoard / boardDimensionsPx)) +
             towerRadiusPct;
    }
  ),

  _reportPosition: Ember.observer('centerLeftPct', 'centerTopPct', function () {
    const towerId = this.attrs.tower.get('id');
    const centerLeftPct = this.get('centerLeftPct');
    const centerTopPct = this.get('centerTopPct');
    this.attrs['report-tower-position'](towerId, 'X', centerLeftPct);
    this.attrs['report-tower-position'](towerId, 'Y', centerTopPct);
  })
});

//////////////////////////////////
//                              //
//   Path Collision Detection   //
//                              //
//////////////////////////////////

TowerComponent.reopen({
  classNameBindings: ['collidesWithPath:tower--colliding'],

  collidesWithPath: Ember.computed(
    'attrs.path.[]',
    'elementInserted',
    'centerLeftPct',
    'centerTopPct',
    function () {
      if (!this.get('elementInserted')) {
        return false;
      }

      const towerLeftPct = this.get('centerLeftPct');
      const towerTopPct = this.get('centerTopPct');
      const towerRadius = towerDimensions / 2;
      const pathRadius = pathWidth / 2;

      // The path is an array of points, and if you draw a line from one point
      // to the next, you have created a "segment". This function loops through
      // each of the points, creates a segment, and checks to see if tower
      // intersects the segment.
      return this.attrs.path.any((pathCoords, index) => {
        const nextCoords = this.attrs.path.objectAt(index + 1);
        if (!nextCoords) {
          return false;
        }

        const pathCoordsX = pathCoords.get('x');
        const nextCoordsX = nextCoords.get('x');
        const lowestPathLeftPct = Math.min(pathCoordsX, nextCoordsX) - pathRadius;
        const highestPathLeftPct = Math.max(pathCoordsX, nextCoordsX) + pathRadius;
        const xIntersects = towerLeftPct + towerRadius >= lowestPathLeftPct &&
                            towerLeftPct - towerRadius <= highestPathLeftPct;
        if (!xIntersects) {
          return false;
        }

        const pathCoordsY = pathCoords.get('y');
        const nextCoordsY = nextCoords.get('y');
        const lowestPathTopPct = Math.min(pathCoordsY, nextCoordsY) - pathRadius;
        const highestPathTopPct = Math.max(pathCoordsY, nextCoordsY) + pathRadius;
        const yIntersects = towerTopPct + towerRadius >= lowestPathTopPct &&
                            towerTopPct - towerRadius <= highestPathTopPct;
        return yIntersects;
      });
    }
  ),

  _updateTowersColliding: Ember.observer('collidesWithPath', function () {
    const collisionAction = this.get('collidesWithPath') ?
                            'add-colliding-tower' :
                            'remove-colliding-tower';
    this.attrs[collisionAction](this.attrs.tower.get('id'));
  })
});

////////////////
//            //
//   Sizing   //
//            //
////////////////

TowerComponent.reopen({
  resizeFn: null, // will be set to a function that we call on window resize

  _setTowerDimensions: Ember.on('didInsertElement', function () {
    const $board = Ember.$('.td-game__board');
    const boardDimensions = $board.width(); // width === height
    const towerDimensionsPx = (towerDimensions / 100) * boardDimensions;
    this.$().css('width', towerDimensionsPx);
    this.$().css('height', towerDimensionsPx);

    // the tower's cannon forms a rectangle using the following border styles
    Ember.$('.turret__cannon').css({
      'height': `${towerDimensionsPx / 2}px`,
      'width': `${towerDimensionsPx / 4}px `
    });
  }),

  _stopWatchingWindowResize: Ember.on('willDestroyElement', function () {
    Ember.$(window).off('resize', this.get('resizeFn'));
  }),

  _updateDimensionsOnWindowResize: Ember.on('didInsertElement', function () {
    const resizeFn = Ember.run.bind(this, '_setTowerDimensions');
    Ember.$(window).on('resize', resizeFn);

    Ember.run.schedule('afterRender', this, () => {
      this.set('resizeFn', resizeFn);
    });
  })
});


///////////////////////////////////
//                               //
//   Rotation (Facing Targets)   //
//                               //
///////////////////////////////////

TowerComponent.reopen({
  // facingTarget: false,

  _getNumFromPx(pixels) {
    if (!pixels) {
      return undefined;
    }

    const valWithoutPx = pixels.split('px')[0];
    return parseInt(valWithoutPx, 10);
  },

  _getTargetPercentageLeft() {
    const leftPxStr = Ember.$(`#${this.attrs.tower.get('targetId')}`).css('left');
    const leftPx = this._getNumFromPx(leftPxStr);
    const boardWidthPx = Ember.$('.td-game__board').width();
    return (leftPx / boardWidthPx) * 100;
  },

  _getTargetPercentageTop() {
    const topPxStr = Ember.$(`#${this.attrs.tower.get('targetId')}`).css('top');
    const topPx = this._getNumFromPx(topPxStr);
    const boardHeightPx = Ember.$('.td-game__board').height();
    return (topPx / boardHeightPx) * 100;
  },

  _faceTarget: Ember.observer('targetId', function () {
    if (!this.attrs.waveStarted || !this.get('targetId') || this.get('towerUpgraded')) {
      return;
    }

    const target = this._getMobById(this.get('targetId'));
    if (!target) {
      this.set('targetId', null);
      return;
    }

    const targetLeftPct = target.get('posX');
    const targetTopPct = target.get('posY');

    // find the target's position relative to this tower
    // e.g. given a tower position of [1,1] and a target position of [3,3], the
    //      relative target position would be [2, -2]
    const relTargetPctLeft = targetLeftPct - this.get('centerLeftPct');
    const relTargetPctTop = this.get('centerTopPct') - targetTopPct;

    const rotationDegrees = Math.atan2(
      relTargetPctLeft,
      relTargetPctTop
    ) / Math.PI * 180;

    this.$('.tower__body').css({'-webkit-transform': `rotate(${rotationDegrees}deg)`,
                                '-moz-transform': `rotate(${rotationDegrees}deg)`,
                                '-ms-transform': `rotate(${rotationDegrees}deg)`,
                                'transform': `rotate(${rotationDegrees}deg)`});

    Ember.run.later(this, () => {
      if (!this.get('isDestroying')) {
        this._faceTarget();
      }
    }, 50);
  }),

  _startSpinning: Ember.observer('attrs.waveStarted', function () {
    if (this.get('towerUpgraded') && this.attrs.waveStarted) {
      this.$('.tower__body').css({'-webkit-animation': `rotating 2s linear infinite`,
                                  '-moz-animation': `rotating 2s linear infinite`,
                                  '-ms-animation': `rotating 2s linear infinite`,
                                  '-o-animation': `rotating 2s linear infinite`,
                                  'animation': `rotating 2s linear infinite`});
    }
  })
});

///////////////////
//               //
//   Targeting   //
//               //
///////////////////

TowerComponent.reopen({
  targetId: null,

  _attackMobsInRange() {
    if (this.attrs.mobs.length < 1) {
      return;
    }

    const range = this.attrs.towerAttackRange;
    let towerHasShot = false;
    this.attrs.mobs.forEach((mob) => {
      const mobInRange = this._mobInRange(mob, range);
      const mobAlive = mob.get('health') > 0;

      if (mobInRange && mobAlive && !towerHasShot) {
        if (!this.get('towerUpgraded')) {
          towerHasShot = true;
        }

        const mobId = mob.get('id');
        this.set('targetId', mobId);
        this._buildProjectile(mobId);
      }
    });

    if (!towerHasShot) {
      this.set('targetId', null);
    }

    Ember.run.later(this, () => {
      if (!this.get('isDestroying') && this.attrs.waveStarted) {
        this._attackMobsInRange();
      }
    }, this.get('towerUpgraded') ? 1500 : 500);
  },

  _getTargetDistance(target) {
    const tower = this.attrs.tower;
    const latDiff = Math.abs(tower.get('posX') - target.get('posX'));
    const lngDiff = Math.abs(tower.get('posY') - target.get('posY'));
    return latDiff + lngDiff;
  },

  _mobInRange(mob, range) {
    if (!mob) {
      return false;
    }

    return this._getTargetDistance(mob) < range ? true : false;
  },

  _beginAttackingMobsInRange: Ember.observer('attrs.waveStarted', function () {
    if (this.attrs.waveStarted) {
      this._attackMobsInRange();
    }
  })
});

/////////////////////
//                 //
//   Projectiles   //
//                 //
/////////////////////

TowerComponent.reopen({
  cannonBlast: null,

  _buildProjectile(mobId) {
    const targetedMob = this._getMobById(mobId);
    if (targetedMob) {
      const newProjectile = Projectile.create({
        id: this._generateIdForProjectile(),
        mobId: mobId,

        mobX: targetedMob.get('posX'),
        mobY: targetedMob.get('posY')
      });

      this.get('projectiles').addObject(newProjectile);

      this._playCannonSound(mobId);

      return;
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

  _getMobById(mobId) {
    let needle;
    this.attrs.mobs.forEach((mob) => {
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

  _playCannonSound(mobId) {
    const cannonType = this.get('towerUpgraded') ? 2 : 1;
    this.set('cannonBlast', new Audio(`/sounds/cannon-${cannonType}.mp3`));

    // volumeKey: 0: up, 1: down, 2: off
    switch (this.attrs.volumeKey) {
      case 0:
        this.set('cannonBlast.volume', 0.5);
        break;
      case 1:
        this.set('cannonBlast.volume', 0.2);
        break;
      case 2:
        this.set('cannonBlast.volume', 0);
        break;
    }
    this.get('cannonBlast').play();
    this.set('cannonBlast', null);
  },

  projectiles: Ember.computed(function () {
    return [];
  }),

  actions: {
    destroyProjectile(projectileId) {
      if (this.get('isDestroying') || !this.attrs.waveStarted) {
        return;
      }

      const projectile = this._getProjectileById(projectileId);
      const projectileFound = !!projectile;
      const projectilesFound = this.get('projectiles.length') > 0;
      if (projectileFound && projectilesFound) {
        const projectileIndex = this.get('projectiles').indexOf(projectile);
        this.get('projectiles').removeAt(projectileIndex);
      }
    }
  }
});

export default TowerComponent;
