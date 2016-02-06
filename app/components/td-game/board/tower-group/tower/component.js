import Ember from 'ember';
import { pathWidth } from 'tower-defense/objects/board';
import { towerDimensions } from 'tower-defense/objects/tower';

////////////////
//            //
//   Basics   //
//            //
////////////////

const TowerComponent = Ember.Component.extend({
  classNameBindings: ['selected:tower-group__tower--selected'],

  classNames: ['tower-group__tower'],
});

////////////////////////////
//                        //
//   Upgrade Management   //
//                        //
////////////////////////////

TowerComponent.reopen({
  applyTowerType: Ember.on('didInsertElement', function () {
    Ember.run.schedule('afterRender', this, () => {
      if (this.attrs.type === 2) {
        this.$().css('background-color', 'black');
        const attackPower = this.attrs.tower.get('attackPower');
        this.attrs.tower.set('attackPower', attackPower + 20);
      }
    });
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
  }),

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

export default TowerComponent;
