import Ember from 'ember';
import Mob from 'tower-defense/objects/mob';

export default Ember.Component.extend({
  classNames: ['td-game__board'],

  classNameBindings: ['positionRelative:td-game__board--relative'],

  numMobsGenerated: 1,

  positionRelative: false,

  mobs: Ember.A([]),

  mobSchema: null,

  _generateFirstMob(newMob) {
    this.get('mobs').pushObject(newMob);
    this.set('numMobsGenerated', this.get('numMobsGenerated') + 1);
  },

  _generateMobs(mobSchema, newMob, quantity, frequency) {
    setTimeout(() => {
      this.get('mobs').pushObject(newMob);
      this.set('numMobsGenerated', this.get('numMobsGenerated') + 1);
      if (this.get('numMobsGenerated') < quantity) {
        this._generateMobs(
          mobSchema, this._getNewMob(mobSchema), quantity, frequency
        );
      }
    }, frequency);
  },

  _getNewMob(mobSchema) {
    return Mob.create({
      frequency: mobSchema.frequency,
      number: this.get('numMobsGenerated'),
      remainingHealth: mobSchema.maxHealth,
      points: mobSchema.points,
      quantity: mobSchema.quantity,
      speed: mobSchema.speed,
      type: mobSchema.type
    });
  },

  repositionBoard: Ember.observer('attrs.waveStarted', function () {
    this.set('positionRelative', true);
  }),

  produceMobs: Ember.observer('attrs.waveStarted', function () {
    this.attrs.mobs.forEach((mobSchema) => {
      this._generateFirstMob(this._getNewMob(mobSchema));

      this._generateMobs(
        mobSchema,
        this._getNewMob(mobSchema),
        mobSchema.get('quantity') + 1,
        mobSchema.get('frequency')
      );
    });
  })
});
