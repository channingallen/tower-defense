import Ember from 'ember';

export function initialize() {
  Ember.Object.reopen({
    forceSet(key, newValue, { queue } = { queue: 'afterRender' }) {
      const currentValue = this.get(key);

      if (currentValue === newValue) {
        this.set(key, undefined);
        Ember.run.scheduleOnce(queue, this, () => {
          this.set(key, newValue);
        });
      } else {
        this.set(key, newValue);
      }
    }
  });
}

export default {
  name: 'add-force-set',
  initialize
};
