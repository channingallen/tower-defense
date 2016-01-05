import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['sidebar__stylesheet'],

  // unitCodeLines:
  // [
  //   {
  //     codeLine: undefined,
  //     submitted: false,
  //     id: null,
  //     unitType: null // tower or tower group
  //   },
  //   {...}
  // ]
  twrCodeLines: null,

  twrGrpCodeLines: null,

  actions: {
    submitCodeLines() {
      const twrGrpCodeLines = this.get('twrGrpCodeLines');
      const twrCodeLines = this.get('twrCodeLines');

      // TODO THIS COMMIT: send up signifier of WHICH tower/group these styles
      //                   apply to, since in the future there will be more than
      //                   one tower/group on the board;
      //                   i.e., include the selectedTower/Group in the args
      this.attrs['submit-styles'](twrGrpCodeLines, twrCodeLines);
    },

    updateTowerCodeLines(twrCodeLines) {
      this.set('twrCodeLines', twrCodeLines);
    },

    updateTowerGroupCodeLines(twrGrpCodeLines) {
      this.set('twrGrpCodeLines', twrGrpCodeLines);
    },
  }
});
