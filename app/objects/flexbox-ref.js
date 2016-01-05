import Ember from 'ember';

const FlexboxRef = Ember.Object.extend({
  order: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'initial', 'inherit'],

  'align-content': [
    'stretch',
    'center',
    'flex-start',
    'flex-end',
    'space-between',
    'space-around',
    'initial',
    'inherit'
  ],

  'align-items': [
    'stretch',
    'center',
    'flex-start',
    'flex-end',
    'baseline',
    'initial',
    'inherit'
  ],

  'align-self': [
    'auto',
    'stetch',
    'center',
    'flex-start',
    'flex-end',
    'baseline',
    'initial',
    'inherit'
  ],

  'flex-direction': [
    'row',
    'row-reverse',
    'column',
    'column-reverse',
    'initial',
    'inherit'
  ],

  'flex-wrap': [
    'nowrap',
    'wrap',
    'wrap-reverse',
    'initial',
    'inherit'
  ],

  'justify-content': [
    'flex-start',
    'flex-end',
    'center',
    'space-between',
    'space-around',
    'initial',
    'inherit'
  ]
});

export default FlexboxRef;
