import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['sidebar__stylesheet'],

  twrStyles: null,

  twrGrpStyles: null,

  shakeActive: false,

  _delayNextShake() {
    this.set('shakeActive', true);

    Ember.run.later(this, () => {
      this.set('shakeActive', false);
    }, 1300);
  },

  actions: {
    shake() {
      if (this.get('shakeActive')) {
        return;
      }

      this._delayNextShake();

      let l = 20;
      for (let i = 0; i < 10; i++) {
        this.$().animate({
          'margin-left': "+=" + (l = -l) + 'px',
          'margin-right': "-=" + l + 'px'
        }, 115);
      }
    },

    startWave() {
      this.attrs['start-wave']();
    },

    submitCodeLines(unitType, unitCodeLines) {
      if (unitType === 'tower') {
        this.set('twrStyles', unitCodeLines);
      } else {
        this.set('twrGrpStyles', unitCodeLines);
      }

      const twrGrpStyles = this.get('twrGrpStyles');
      const twrStyles = this.get('twrStyles');

      this.attrs['submit-styles'](twrGrpStyles, twrStyles);
    }
  }
});
