import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['sidebar__stylesheet'],

  twrStyles: null,

  twrGrpStyles: null,

  actions: {
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
