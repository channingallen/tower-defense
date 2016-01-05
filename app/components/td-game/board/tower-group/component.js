import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['board__tower-group'],

  classNameBindings: [
    'cssJustifyLeft:board__tower-group--justify-left',
    'cssJustifyBetween:board__tower-group--justify-between',
    'cssJustifyAround:board__tower-group--justify-around',
    'cssJustifyCenter:board__tower-group--justify-center',
    'cssJustifyRight:board__tower-group--justify-right',
    'selected:board__tower-group--selected'
  ],

  _styleFound(styleNeedle) {
    let styleApplicable = false;
    styleNeedle = styleNeedle.replace(/ /g,'');
    const towerGroupStyles = this.attrs.towerGroup.get('styles');

    towerGroupStyles.forEach((styleHaystack) => {
      if (styleHaystack.get('codeLine')) {
        const styleNoWhitespace = styleHaystack.get('codeLine').replace(/ /g,'');
        styleHaystack.set('codeLine', styleNoWhitespace);

        if (styleHaystack.get('codeLine') === styleNeedle) {
          styleApplicable = true;
        }
      }
    });

    return styleApplicable;
  },

  selected: Ember.computed(
    'attrs.selectedTowerGroup',
    'attrs.towerGroup',
    function () {
      return this.attrs.selectedTowerGroup === this.attrs.towerGroup ?
             true :
             false;
     }
  ),

  cssJustifyLeft: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('justify-content:flex-start');
    }
  ),

  cssJustifyRight: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('justify-content:flex-end');
    }
  ),

  cssJustifyBetween: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('justify-content:space-between');
    }
  ),

  cssJustifyAround: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('justify-content:space-around');
    }
  ),

  cssJustifyCenter: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('justify-content:center');
    }
  ),

  cssJustifyRight: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('justify-content:flex-end');
    }
  )
});
