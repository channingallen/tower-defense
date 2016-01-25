import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['sidebar__stylesheet'],

  finalTowerId: null,

  firstTowerGroupId: null,

  shakeActive: false,

  _delayNextShake() {
    this.set('shakeActive', true);

    Ember.run.later(this, () => {
      this.set('shakeActive', false);
    }, 1300);
  },

  _resetStylesheet: Ember.observer('attrs.waveStarted', function () {
    if (!this.attrs.waveStarted) {
      this.set('finalTowerId', null);
      this.set('firstTowerGroupId', null);
      this.set('shakeActive', false);
    }
  }),

  _setFirstAndFinalUnitIds: Ember.on('init', Ember.observer('attrs.waveStarted', function () {
    if (!this.attrs.waveStarted) {
      const firstTowerGroup = this.attrs.towerGroups.get('firstObject');
      const firstTowerGroupId = firstTowerGroup.get('id');
      this.set('firstTowerGroupId', firstTowerGroupId);

      const finalTowerGroup = this.attrs.towerGroups.get('lastObject');
      const finalTower = finalTowerGroup.get('towers').get('lastObject');
      const finalTowerId = finalTower.get('id');
      this.set('finalTowerId', finalTowerId);
    }
  })),

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
    }
  }
});
