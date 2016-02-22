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

  selected: Ember.computed(
    'attrs.selectedTowerGroup',
    'attrs.towerGroup',
    function () {
      return this.attrs.selectedTowerGroup === this.attrs.towerGroup ?
             true :
             false;
    }
  )
});

////////////////
//            //
//   Towers   //
//            //
////////////////

TowerGroupComponent.reopen({
  groupTowers: Ember.computed('attrs.towerGroup', function () {
    let towers = [];

    this.attrs.towerGroup.get('towers').forEach((tower) => {
      towers.push(tower);
    });

    return towers;
  })
});

//////////////////////////////
//                          //
//   Code Line Management   //
//                          //
//////////////////////////////

TowerGroupComponent.reopen({
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

          if (property && value) {
            this.$().css(property, this._getValueWithoutSemiColon(value));
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
  },

  _setPadding() {
    this.$().css('padding', `${spaceBetweenTowersPct}%`);
  },

  _setPosition() {
    this.$().css('left', `${boardPaddingPct}%`);
  },

  _setWidth() {
    const width = 100 - (boardPaddingPct * 2);
    this.$().css('width', `${width}%`);
  },

  _initializeStyles: Ember.on('didInsertElement', function () {
    Ember.run.schedule('afterRender', this, () => {
      this._setHeight();
      this._setPadding();
      this._setWidth();
      this._setPosition();

      this.set('stylesInitialized', true);
    });
  })
});

export default TowerGroupComponent;
