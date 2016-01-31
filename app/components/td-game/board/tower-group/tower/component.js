import Ember from 'ember';
import { pathWidth } from 'tower-defense/objects/board';
import { towerDimensions } from 'tower-defense/objects/tower';

////////////////
//            //
//   Basics   //
//            //
////////////////

const TowerComponent = Ember.Component.extend({
  classNameBindings: [
    'selected:tower-group__tower--selected'
  ],

  classNames: ['tower-group__tower'],

  _clearPreviousStyles() {
    this.$().css('justify-content', 'flex-start');
    this.$().css('align-items', 'flex-start');
  },

  _getPosLeft() {
    const $board = Ember.$('.td-game__board');
    const $tower = this.$();
    if (!$board || !$tower) {
      return;
    }

    const $boardDistanceFromLeft = $board.offset().left;
    const $towerDistanceFromLeft = $tower.offset().left;

    const $towerDistanceFromBoardLeft = Math.abs(
      $boardDistanceFromLeft - $towerDistanceFromLeft
    );

    const $boardLength = $board.innerHeight(); // height & width
    return Math.floor(100 * ($towerDistanceFromBoardLeft / $boardLength));
  },

  _getPosTop() {
    const $board = Ember.$('.td-game__board');
    const $tower = this.$();
    if (!$board || !$tower) {
      return;
    }

    const $boardDistanceFromTop = $board.offset().top;
    const $towerDistanceFromTop = $tower.offset().top;

    const $towerDistanceFromBoardTop = Math.abs(
      $boardDistanceFromTop - $towerDistanceFromTop
    );

    const $boardLength = $board.innerHeight(); // height & width
    return Math.floor(100 * ($towerDistanceFromBoardTop / $boardLength));
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
  ),

  _updatePosition: Ember.observer('attrs.waveStarted', function () {
    if (!this.attrs.waveStarted) {
      return;
    }

    const towerId = this.attrs.tower.get('id');

    Ember.run.later(this, () => {
      if (!this.attrs.waveStarted) {
        return;
      }

      const posLeft = this._getPosLeft();
      const posTop = this._getPosTop();

      if (posTop && posLeft) {
        this.attrs['update-tower-position'](towerId, 'X', posLeft);
        this.attrs['update-tower-position'](towerId, 'Y', posTop);
      }
    }, 200);
  })
});

/////////////////////////////
//                         //
//   Position Management   //
//                         //
/////////////////////////////

TowerComponent.reopen({
  posX: Ember.computed(
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
      const boardDistanceFromLeft = $board.offset().left;
      const $tower = this.$();
      const towerDistanceFromLeft = $tower.offset().left;

      const towerDistanceFromBoardLeft = Math.abs(
        boardDistanceFromLeft - towerDistanceFromLeft
      );

      const boardDimensions = $board.innerHeight(); // height === width
      return Math.floor(100 * (towerDistanceFromBoardLeft / boardDimensions));
    }
  ),

  posY: Ember.computed(
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
      const boardDistanceFromTop = $board.offset().top;
      const $tower = this.$();
      const towerDistanceFromTop = $tower.offset().top;

      const towerDistanceFromBoardTop = Math.abs(
        boardDistanceFromTop - towerDistanceFromTop
      );

      const boardDimensions = $board.innerHeight(); // height === width
      return Math.floor(100 * (towerDistanceFromBoardTop / boardDimensions));
    }
  )
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
    'posX',
    'posY',
    function () {
      if (!this.get('elementInserted')) {
        return false;
      }

      const towerX = this.get('posX');
      const towerY = this.get('posY');
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
        const lowestX = Math.min(pathCoordsX, nextCoordsX) - pathRadius;
        const highestX = Math.max(pathCoordsX, nextCoordsX) + pathRadius;
        const xIntersects = towerX + towerRadius >= lowestX &&
                            towerX - towerRadius <= highestX;
        if (!xIntersects) {
          return false;
        }

        const pathCoordsY = pathCoords.get('y');
        const nextCoordsY = nextCoords.get('y');
        const lowestY = Math.min(pathCoordsY, nextCoordsY) - pathRadius;
        const highestY = Math.max(pathCoordsY, nextCoordsY) + pathRadius;
        const yIntersects = towerY + towerRadius >= lowestY &&
                            towerY - towerRadius <= highestY;
        return yIntersects;
      });
    }
  )
});

////////////////
//            //
//   Sizing   //
//            //
////////////////

TowerComponent.reopen({
  _setTowerDimensions: Ember.on('didInsertElement', function () {
    const $board = Ember.$('.td-game__board');
    const boardDimensions = $board.width(); // width === height
    const towerDimensionsPx = (towerDimensions / 100) * boardDimensions;
    this.$().css('width', towerDimensionsPx);
    this.$().css('height', towerDimensionsPx);
  }),

  _updateDimensionsOnWindowResize: Ember.on('didInsertElement', function () {
    Ember.$(window).on('resize', Ember.run.bind(this, '_setTowerDimensions'));
  })
});

export default TowerComponent;
