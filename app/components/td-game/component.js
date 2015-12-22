import Ember from 'ember';
import createWave from 'tower-defense/utils/create-wave';

export default Ember.Component.extend({
  classNames: ['td-game'],

  currentWave: createWave(),

  waveStarted: false,

  actions: {
    startWave() {
      this.set('waveStarted', true);
    }
  }
});
