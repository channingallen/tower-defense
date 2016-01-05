import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['tower-group__tower'],

  classNameBindings: [
    // TODO THIS COMMIT: apply or discard flex-flow properties
    'cssAlignSelfAuto:tower-group__tower--a-s-auto',
    'cssAlignSelfStretch:tower-group__tower--a-s-stretch',
    'cssAlignSelfCenter:tower-group__tower--a-s-center',
    'cssAlignSelfStart:tower-group__tower--a-s-start',
    'cssAlignSelfEnd:tower-group__tower--a-s-end',
    'cssAlignSelfBaseline:tower-group__tower--a-s-baseline',
    'cssAlignSelfInitial:tower-group__tower--a-s-initial',
    'cssAlignSelfInherit:tower-group__tower--a-s-inherit',
    'cssOrder0:tower-group__tower--order-0',
    'cssOrder1:tower-group__tower--order-1',
    'cssOrder2:tower-group__tower--order-2',
    'cssOrder3:tower-group__tower--order-3',
    'cssOrder4:tower-group__tower--order-4',
    'cssOrder5:tower-group__tower--order-5',
    'cssOrder6:tower-group__tower--order-6',
    'cssOrder7:tower-group__tower--order-7',
    'cssOrder8:tower-group__tower--order-8',
    'cssOrder9:tower-group__tower--order-9',
    'cssOrderInitial:tower-group__tower--order-initial',
    'cssOrderInherit:tower-group__tower--order-inherit',
    'selected:tower-group__tower--selected'
  ],

  _styleFound(styleNeedle) {
    let styleApplicable = false;
    styleNeedle = styleNeedle.replace(/ /g,'');
    const towerStyles = this.attrs.tower.get('styles');

    towerStyles.forEach((styleHaystack) => {
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

  cssAlignSelfAuto: Ember.computed(
    'attrs.tower.styles.[]',
    function () {
      return this._styleFound('align-self:auto');
    }
  ),

  cssAlignSelfStretch: Ember.computed(
    'attrs.tower.styles.[]',
    function () {
      return this._styleFound('align-self:stretch');
    }
  ),

  cssAlignSelfCenter: Ember.computed(
    'attrs.tower.styles.[]',
    function () {
      return this._styleFound('align-self:center');
    }
  ),

  cssAlignSelfStart: Ember.computed(
    'attrs.tower.styles.[]',
    function () {
      return this._styleFound('align-self:flex-start');
    }
  ),

  cssAlignSelfEnd: Ember.computed(
    'attrs.tower.styles.[]',
    function () {
      return this._styleFound('align-self:flex-end');
    }
  ),

  cssAlignSelfBaseline: Ember.computed(
    'attrs.tower.styles.[]',
    function () {
      return this._styleFound('align-self:baseline');
    }
  ),

  cssAlignSelfInitial: Ember.computed(
    'attrs.tower.styles.[]',
    function () {
      return this._styleFound('align-self:initial');
    }
  ),

  cssAlignSelfInherit: Ember.computed(
    'attrs.tower.styles.[]',
    function () {
      return this._styleFound('align-self:inherit');
    }
  ),

  cssOrder0: Ember.computed(
    'attrs.tower.styles.[]',
    function () {
      return this._styleFound('order:0');
    }
  ),

  cssOrder1: Ember.computed(
    'attrs.tower.styles.[]',
    function () {
      return this._styleFound('order:1');
    }
  ),

  cssOrder2: Ember.computed(
    'attrs.tower.styles.[]',
    function () {
      return this._styleFound('order:2');
    }
  ),

  cssOrder3: Ember.computed(
    'attrs.tower.styles.[]',
    function () {
      return this._styleFound('order:3');
    }
  ),

  cssOrder4: Ember.computed(
    'attrs.tower.styles.[]',
    function () {
      return this._styleFound('order:4');
    }
  ),

  cssOrder5: Ember.computed(
    'attrs.tower.styles.[]',
    function () {
      return this._styleFound('order:5');
    }
  ),

  cssOrder6: Ember.computed(
    'attrs.tower.styles.[]',
    function () {
      return this._styleFound('order:6');
    }
  ),

  cssOrder7: Ember.computed(
    'attrs.tower.styles.[]',
    function () {
      return this._styleFound('order:7');
    }
  ),

  cssOrder8: Ember.computed(
    'attrs.tower.styles.[]',
    function () {
      return this._styleFound('order:8');
    }
  ),

  cssOrder9: Ember.computed(
    'attrs.tower.styles.[]',
    function () {
      return this._styleFound('order:9');
    }
  ),

  cssOrderInitial: Ember.computed(
    'attrs.tower.styles.[]',
    function () {
      return this._styleFound('order:initial');
    }
  ),

  cssOrderInherit: Ember.computed(
    'attrs.tower.styles.[]',
    function () {
      return this._styleFound('order:inherit');
    }
  ),

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
  )
});
