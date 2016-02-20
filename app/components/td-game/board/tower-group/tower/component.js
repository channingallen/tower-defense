import Ember from 'ember';
import { pathWidth } from 'tower-defense/objects/board';
import { towerDimensions } from 'tower-defense/objects/tower';

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

  applyTowerType: Ember.on('didInsertElement', function () {
    Ember.run.schedule('afterRender', this, () => {
      if (this.attrs.type === 2) {
        this.set('towerUpgraded', true);

        const attackPower = this.attrs.tower.get('attackPower');
        this.attrs.tower.set('attackPower', attackPower + 20);
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
    function () {
      return this.attrs.selectedTower === this.attrs.tower ? true : false;
    }
  ),

  _sendSelectAction: Ember.on('click', function (clickEvent) {
    clickEvent.stopPropagation();

    this.attrs.select(this.attrs.tower);
  })
});


//////////////////////////////
//                          //
//   Code Line Management   //
//                          //
//////////////////////////////

TowerComponent.reopen({
  _clearPreviousStyles() {
    this.$().css('justify-content', 'flex-start');
    this.$().css('align-items', 'flex-start');
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
      const styleFound = !!styles;

      let codeLineEmpty = true;
      if (styleFound) {
        const firstCodeLine = styles.get('firstObject');
        const codeLineLength = firstCodeLine.get('codeLine.length');
        codeLineEmpty = isNaN(codeLineLength) || codeLineLength < 1;
      }

      this._clearPreviousStyles();
      if (!styleFound || codeLineEmpty) {
        return;
      }

      styles.forEach((style) => {
        const codeLine = style.get('codeLine');

        if (this._styleFound(codeLine)) {
          const property = this._getProperty(codeLine);
          const value = this._getValue(codeLine, property);

          if (property && value) {
            this.$().css(property, this._getValueWithoutSemiColon(value));
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

    Ember.$('.turret__cannon').css({
      'height': `${towerDimensionsPx / 2}px`,
      'width': `${towerDimensionsPx / 4}px `
    });

    // // the tower's cannon forms a triangle using the following border styles
    // // const turretColor = Ember.$('.tower__turret').css('background-color');
    // Ember.$('.turret__cannon').css({
    //   'border-bottom-style': 'solid',
    //   'border-bottom-width': `${towerDimensionsPx / 2}px`,
    //   'border-left': `${towerDimensionsPx / 4}px solid transparent`,
    //   'border-right': `${towerDimensionsPx / 4}px solid transparent`
    // });
  }),

  _stopWatchingWindowResize: Ember.on('willDestroyElement', function () {
    Ember.$(window).off('resize', this.get('resizeFn'));
  }),

  _updateDimensionsOnWindowResize: Ember.on('didInsertElement', function () {
    const resizeFn = Ember.run.bind(this, '_setTowerDimensions');
    Ember.$(window).on('resize', resizeFn);

    this.set('resizeFn', resizeFn);
  })
});


///////////////////////////////////
//                               //
//   Rotation (Facing Targets)   //
//                               //
///////////////////////////////////

TowerComponent.reopen({
  _faceTarget() {
    if (!this.attrs.waveStarted) {
      return;
    }

    if (!this.attrs.tower.get('targetedMobId')) {
      Ember.run.later(this, this._faceTarget, 50);

      return;
    }

    const targetFound = Ember.$(`#${this.attrs.tower.get('targetedMobId')}`).css('left');
    if (!targetFound) {
      this.attrs.tower.set('targetedMobId', null);

      Ember.run.later(this, this._faceTarget, 50);

      return;
    }

    const targetPctLeft = this._getTargetPercentageLeft();
    const targetPctTop = this._getTargetPercentageTop();

    // find the target's position relative to this tower
    // e.g. given a tower position of [1,1] and a target position of [3,3], the
    //      relative target position would be [2, -2]
    const relTargetPctLeft = targetPctLeft - this.get('centerLeftPct');
    const relTargetPctTop = this.get('centerTopPct') - targetPctTop;

    const rotationDegrees = Math.atan2(
      relTargetPctLeft,
      relTargetPctTop
    ) / Math.PI * 180;

    this.$().css({'-webkit-transform': `rotate(${rotationDegrees}deg)`,
                  '-moz-transform': `rotate(${rotationDegrees}deg)`,
                  '-ms-transform': `rotate(${rotationDegrees}deg)`,
                  'transform': `rotate(${rotationDegrees}deg)`});

    Ember.run.later(this, () => {
      if (!this.isDestroying) {
        this._faceTarget();
      }
    }, 50);
  },

  _getNumFromPx(pixels) {
    if (!pixels) {
      return undefined;
    }

    const valWithoutPx = pixels.split('px')[0];
    return parseInt(valWithoutPx, 10);
  },

  _getTargetPercentageLeft() {
    const leftPxStr = Ember.$(`#${this.attrs.tower.get('targetedMobId')}`).css('left');
    const leftPx = this._getNumFromPx(leftPxStr);
    const boardWidthPx = Ember.$('.td-game__board').width();
    return (leftPx / boardWidthPx) * 100;
  },

  _getTargetPercentageTop() {
    const topPxStr = Ember.$(`#${this.attrs.tower.get('targetedMobId')}`).css('top');
    const topPx = this._getNumFromPx(topPxStr);
    const boardHeightPx = Ember.$('.td-game__board').height();
    return (topPx / boardHeightPx) * 100;
  },

  beginFacingTargets: Ember.observer('attrs.waveStarted', function () {
    if (this.attrs.waveStarted) {
      this._faceTarget();
    }
  })
});

export default TowerComponent;
