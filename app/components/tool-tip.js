import Ember from 'ember';

////////////////
//            //
//   Basics   //
//            //
////////////////

const ToolTipComponent = Ember.Component.extend({
  classNameBindings: ['atTop:tool-tip--bottom:tool-tip--top'],

  classNames: ['tool-tip'],

  atTop: null,

  checkOffsetTop: Ember.on('didInsertElement', function () {
    if (!this || !this.$()) {
      return;
    }

    const atTop = this.$().offset().top < 100;
    this.set('atTop', atTop);
  })
});

export default ToolTipComponent;
