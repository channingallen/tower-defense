import Ember from 'ember';

export default Ember.Component.extend({
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

  _setTowerDimensions: Ember.on('didInsertElement', function () {
    const $board = Ember.$('.td-game__board');
    const $newWidth = $board.width() / 27;
    this.$().css('width', $newWidth);
    this.$().css('height', $newWidth);

    Ember.$(window).resize(() => {
      const $newWidth = $board.width() / 27;
      this.$().css('width', $newWidth);
      this.$().css('height', $newWidth);
    });
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

  _updatePosition: Ember.on('didInsertElement', function () {
    const towerId = this.attrs.tower.get('id');

    setInterval(() => {
      const posLeft = this._getPosLeft();
      const posTop = this._getPosTop();

      if (posTop && posLeft) {
        this.attrs['update-tower-position'](towerId, 'X', posLeft);
        this.attrs['update-tower-position'](towerId, 'Y', posTop);
      }
    }, 200);
  })
});
