import Ember from 'ember';
import { boardPaddingPct } from 'tower-defense/objects/board';
import { spaceBetweenTowersPct } from 'tower-defense/objects/tower-group';
import { towerDimensions } from 'tower-defense/objects/tower';

////////////////
//            //
//   Basics   //
//            //
////////////////

const TowerGroupComponent = Ember.Component.extend({
  classNameBindings: ['selected:board__tower-group--selected'],

  classNames: ['board__tower-group'],

  setElementId: Ember.on('init', function () {
    this.set('elementId', `board__tower-group-${this.attrs.groupNum}`);
  })
});

//////////////////////////////
//                          //
//   Code Line Management   //
//                          //
//////////////////////////////

TowerGroupComponent.reopen({
  _clearPreviousStyles() {
    this.$().css('align-items', 'initial');
    this.$().css('flex-direction', 'initial');
    this.$().css('justify-content', 'initial');
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
    const towerGroupStyles = this.attrs.towerGroup.get('styles');

    if (towerGroupStyles) {
      towerGroupStyles.forEach((styleHaystack) => {
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

  _applyCodeLines: Ember.observer(
    'attrs.towerGroup.styles',
    'attrs.towerGroup.styles.[]',
    'attrs.towerGroup.styles.length',
    'attrs.towerGroup.styles.@each.codeLine',
    'attrs.towerGroup.styles.@each.submitted',
    function () {
      const styles = this.attrs.towerGroup.get('styles');
      const styleFound = !!styles && styles.get('length') > 0;

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

          if (property && value && style.get('valid')) {
            const semicolonFound = value[value.length - 1] === ';';

            if (semicolonFound) {
              this.$().css(property, this._getValueWithoutSemiColon(value));
            } else {
              this.$().css(property, value);
            }
          }
        }
      });
    }
  )
});

////////////////
//            //
//   Sizing   //
//            //
////////////////

TowerGroupComponent.reopen({
  stylesInitialized: false,

  _setHeight() {
    const numRows = this.attrs.towerGroup.get('numRows');
    const heightPct = (towerDimensions * numRows) +
                      (spaceBetweenTowersPct * 2) +
                      (spaceBetweenTowersPct * (numRows - 1));
    this.$().css('height', `${heightPct}%`);
    this.$('.board__tower-group--body').css('height', `${heightPct}%`);

    this.get('$groupOverlay').css('height', `${heightPct}%`);
  },

  _setPadding() {
    this.$().css('padding', `${spaceBetweenTowersPct}%`);
  },

  _setPosition() {
    const offsetTopPx = this.$().offset().top;
    const boardHeightVal = Ember.$('.td-game__board').css('height');
    const boardHeightPxStr = boardHeightVal.split('px')[0];
    const boardHeightPx = parseInt(boardHeightPxStr, 10);
    const offsetTopPct = (offsetTopPx / boardHeightPx) * 100;

    this.$().css('margin-left', `${boardPaddingPct}%`);
    this.$().css('margin-top', `${this.attrs.posY - offsetTopPct}%`);

    this.get('$groupOverlay').css('top', `${this.attrs.posY}%`);
    this.get('$groupOverlay').css('left', `${boardPaddingPct}%`);
  },

  _setWidth() {
    const width = 100 - (boardPaddingPct * 2);
    this.$().css('width', `${width}%`);
    this.$('.board__tower-group--body').css('width', `${width}%`);

    this.get('$groupOverlay').css('width', `${width}%`);
  },

  $groupOverlay: Ember.computed(function () {
    const groupNum = this.attrs.groupNum;
    return Ember.$(`#tower-group--overlay-${groupNum}`);
  }),

  _initializeStyles: Ember.on('didInsertElement', function () {
    Ember.run.schedule('afterRender', this, () => {
      this._setHeight();
      this._setPadding();
      this._setWidth();
      this._setPosition();

      this.$('.board__tower-group--body').css('top', `${this.attrs.posY}%`);
      this.$('.board__tower-group--body').css('left', `${boardPaddingPct}%`);

      this.set('stylesInitialized', true);
    });
  })
});

///////////////////
//               //
//   Selection   //
//               //
///////////////////

TowerGroupComponent.reopen({
  selected: Ember.computed(
    'attrs.selectedTowerGroup',
    'attrs.towerGroup',
    'attrs.waveStarted',
    function () {
      if (!this.attrs.waveStarted) {
        return this.attrs.selectedTowerGroup === this.attrs.towerGroup ?
          true :
          false;
      } else {
        return false;
      }
    }
  ),

  _handleClick: Ember.on('click', function (clickEvent) {
    const $clickedEl = Ember.$(clickEvent.target);
    const $towerParents = $clickedEl.parents('.tower-group__tower');
    const isChildOfTower = $towerParents.length > 0;
    if (!isChildOfTower) {
      this.attrs.select();
    }
  }),
});

export default TowerGroupComponent;
