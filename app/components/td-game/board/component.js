import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['td-game__board'],

  classNameBindings: ['positionRelative:td-game__board--relative'],

  numMobsGenerated: 1,

  positionRelative: false,

  mobs: Ember.A([]),

  _generateMobs(mob, quantity, frequency) {
    setTimeout(() => {
      mob.set('number', this.get('numMobsGenerated'));
      this.get('mobs').pushObject({mob});
      this.set('numMobsGenerated', this.get('numMobsGenerated') + 1);

      if (this.get('numMobsGenerated') < quantity) {
        this._generateMobs(mob, quantity, frequency);
      }
    }, frequency);
  },

  repositionBoard: Ember.observer('attrs.waveStarted', function () {
    this.set('positionRelative', true);
  }),

  produceMobs: Ember.observer('attrs.waveStarted', function () {
    this.attrs.mobs.forEach((mob) => {
      this._generateMobs(
        mob,
        mob.get('quantity') + 1,
        mob.get('frequency')
      );
    });
  })
});
