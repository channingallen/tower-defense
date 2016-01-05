import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['sidebar__stylesheet'],

  twrStyles: null,

  twrGrpStyles: null,

  actions: {
    submitCodeLines() {
      const twrGrpStyles = this.get('twrGrpStyles');
      const twrStyles = this.get('twrStyles');

      this.attrs['submit-styles'](twrGrpStyles, twrStyles);
    },

    updateTowerStyles(twrCodeLines) {
      this.set('twrStyles', twrCodeLines);
    },

    updateTowerGroupStyles(twrGrpCodeLines) {
      this.set('twrGrpStyles', twrGrpCodeLines);
    },
  }
});
