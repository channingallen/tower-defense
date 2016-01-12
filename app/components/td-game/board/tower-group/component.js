import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['board__tower-group'],

  classNameBindings: [
    // TODO THIS COMMIT: apply or discard flex-flow properties
    'cssAlignContentStretch:board__tower-group--a-c-stretch',
    'cssAlignContentCenter:board__tower-group--a-c-center',
    'cssAlignContentStart:board__tower-group--a-c-start',
    'cssAlignContentEnd:board__tower-group--a-c-end',
    'cssAlignContentBetween:board__tower-group--a-c-between',
    'cssAlignContentAround:board__tower-group--a-c-around',
    'cssAlignContentInitial:board__tower-group--a-c-initial',
    'cssAlignContentInherit:board__tower-group--a-c-inherit',
    'cssAlignItemsStretch:board__tower-group--a-i-stretch',
    'cssAlignItemsCenter:board__tower-group--a-i-center',
    'cssAlignItemsStart:board__tower-group--a-i-start',
    'cssAlignItemsEnd:board__tower-group--a-i-end',
    'cssAlignItemsBaseline:board__tower-group--a-i-baseline',
    'cssAlignItemsInitial:board__tower-group--a-i-initial',
    'cssAlignItemsInherit:board__tower-group--a-i-inherit',
    'cssFlexDirectionRow:board__tower-group--f-d-row',
    'cssFlexDirectionRowReverse:board__tower-group--f-d-row-reverse',
    'cssFlexDirectionColumn:board__tower-group--f-d-column',
    'cssFlexDirectionColumnReverse:board__tower-group--f-d-column-reverse',
    'cssFlexDirectionInitial:board__tower-group--f-d-initial',
    'cssFlexDirectionInherit:board__tower-group--f-d-inherit',
    'cssFlexWrapNowrap:board__tower-group--f-w-nowrap',
    'cssFlexWrapWrap:board__tower-group--f-w-wrap',
    'cssFlexWrapWrapReverse:board__tower-group--f-w-wrap-reverse',
    'cssFlexWrapInitial:board__tower-group--f-w-initial',
    'cssFlexWrapInherit:board__tower-group--f-w-inherit',
    'cssJustifyStart:board__tower-group--justify-start',
    'cssJustifyBetween:board__tower-group--justify-between',
    'cssJustifyAround:board__tower-group--justify-around',
    'cssJustifyCenter:board__tower-group--justify-center',
    'cssJustifyEnd:board__tower-group--justify-end',
    'selected:board__tower-group--selected'
  ],

  _styleFound(styleNeedle) {
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

  cssAlignContentStretch: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('align-content:stretch');
    }
  ),

  cssAlignContentCenter: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('align-content:center');
    }
  ),

  cssAlignContentStart: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('align-content:flex-start');
    }
  ),

  cssAlignContentEnd: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('align-content:flex-end');
    }
  ),

  cssAlignContentBetween: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('align-content:space-between');
    }
  ),

  cssAlignContentAround: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('align-content:space-around');
    }
  ),

  cssAlignContentInitial: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('align-content:initial');
    }
  ),

  cssAlignContentInherit: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('align-content:inherit');
    }
  ),

  cssAlignItemsStretch: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('align-items:stretch');
    }
  ),

  cssAlignItemsCenter: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('align-items:center');
    }
  ),

  cssAlignItemsStart: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('align-items:flex-start');
    }
  ),

  cssAlignItemsEnd: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('align-items:flex-end');
    }
  ),

  cssAlignItemsBaseline: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('align-items:baseline');
    }
  ),

  cssAlignItemsInitial: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('align-items:initial');
    }
  ),

  cssAlignItemsInherit: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('align-items:inherit');
    }
  ),

  cssFlexDirectionRow: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('flex-direction:row');
    }
  ),

  cssFlexDirectionRowReverse: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('flex-direction:row-reverse');
    }
  ),

  cssFlexDirectionColumn: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('flex-direction:column');
    }
  ),

  cssFlexDirectionColumnReverse: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('flex-direction:column-reverse');
    }
  ),

  cssFlexDirectionInitial: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('flex-direction:initial');
    }
  ),

  cssFlexDirectionInherit: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('flex-direction:inherit');
    }
  ),

  cssFlexWrapNowrap: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('flex-wrap:nowrap');
    }
  ),

  cssFlexWrapWrap: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('flex-wrap:wrap');
    }
  ),

  cssFlexWrapWrapReverse: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('flex-wrap:wrap-reverse');
    }
  ),

  cssFlexWrapInitial: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('flex-wrap:initial');
    }
  ),

  cssFlexWrapInherit: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('flex-wrap:inherit');
    }
  ),

  cssFlowDirectionRow: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('flex-flow:flex-direction row');
    }
  ),

  cssFlowDirectionRowReverse: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('flex-flow:flex-direction row-reverse');
    }
  ),

  cssFlowDirectionColumn: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('flex-flow:flex-direction column');
    }
  ),

  cssFlowDirectionColumnReverse: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('flex-flow:flex-direction column-reverse');
    }
  ),

  cssFlowDirectionInitial: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('flex-flow:flex-direction initial');
    }
  ),

  cssFlowDirectionInherit: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('flex-flow:flex-direction inherit');
    }
  ),

  cssFlowWrapNowrap: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('flex-flow:flex-wrap nowrap');
    }
  ),

  cssFlowWrapWrap: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('flex-flow:flex-wrap wrap');
    }
  ),

  cssFlowWrapWrapReverse: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('flex-flow:flex-wrap wrap-reverse');
    }
  ),

  cssFlowWrapInitial: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('flex-flow:flex-wrap initial');
    }
  ),

  cssFlowWrapInherit: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('flex-flow:flex-wrap inherit');
    }
  ),

  cssFlowInitial: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('flex-flow:initial');
    }
  ),

  cssFlowInherit: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('flex-flow:inherit');
    }
  ),

  cssJustifyStart: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('justify-content:flex-start');
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

  cssJustifyEnd: Ember.computed(
    'attrs.towerGroup.styles.[]',
    function () {
      return this._styleFound('justify-content:flex-end');
    }
  ),

  groupTowers: Ember.computed('attrs.towerGroup', function () {
    let towers = [];

    this.attrs.towerGroup.get('towers').forEach((tower) => {
      towers.push(tower);
    });

    return towers;
  }),

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
