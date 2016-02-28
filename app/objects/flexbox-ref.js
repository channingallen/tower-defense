import Ember from 'ember';

const FlexboxRef = Ember.Object.extend({
  container: Ember.Object.extend({
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
    ],
  }).create(),

  item: Ember.Object.extend({
    order: ['initial', 'inherit'],

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

    _populateOrder: Ember.on('init', function () {
      for (var i = -100; i < 101; i++) {
        this.get('order').push(i);
      }
    })
  }).create()
});

export default FlexboxRef;
