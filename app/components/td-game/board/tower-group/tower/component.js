import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['tower-group__tower'],

  classNameBindings: [
    'selected:tower-group__tower--selected'
  ],

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

  _styleFound(styleNeedle) {
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

  _sendSelectAction: Ember.on('click', function (clickEvent) {
    clickEvent.stopPropagation();

    this.attrs.select(this.attrs.tower);
  }),

  selected: Ember.computed(
    'attrs.selectedTower',
    'attrs.tower',
    function () {
      return this.attrs.selectedTower === this.attrs.tower ? true : false;
    }
  ),

  updatePosition: Ember.on('didInsertElement', function () {
    const towerId = this.attrs.tower.get('id');

    setInterval(() => {
      const posLeft = this._getPosLeft();
      const posTop = this._getPosTop();

      if (posTop && posLeft) {
        this.attrs['update-tower-position'](towerId, 'X', posLeft);
        this.attrs['update-tower-position'](towerId, 'Y', posTop);
      }
    }, 200);
  }),

  updateStyle: Ember.observer(
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

      if (!styleFound || codeLineEmpty) {
        this.$().css('justify-content', 'flex-start');
        this.$().css('align-items', 'flex-start');
        return;
      }

      styles.forEach((style) => {
        const codeLine = style.get('codeLine');

        if (this._styleFound(codeLine)) {
          const property = this._getProperty(codeLine);
          const value = this._getValue(codeLine, property);

          if (property && value) {
            this.$().css(property, value);
          }
        }
      });
    }
  )
});
