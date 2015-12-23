import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['stylesheet__block'],

  inputViewName: 'input', // This can be called anything.

  tagName: 'ol',

  _autoFocusInput: Ember.observer(
    'attrs.selectedTower',
    'attrs.selectedTowerGroup',
    'attrs.tower',
    'attrs.towerGroup',
    function () {
      if (this.attrs.selectedTower) {
        if (this.attrs.selectedTower === this.attrs.tower) {
          const inputViewName = this.get('inputViewName');
          const inputComponent = this.get(inputViewName);
          const inputEl = inputComponent.get('element');
          inputEl.focus();
        }
      } else if (this.attrs.selectedTowerGroup) {
        if (this.attrs.selectedTowerGroup === this.attrs.towerGroup) {
          const inputViewName = this.get('inputViewName');
          const inputComponent = this.get(inputViewName);
          const inputEl = inputComponent.get('element');
          inputEl.focus();
        }
      }
    }
  ),

  selector: Ember.computed(
    'attrs.tower.selector',
    'attrs.towerGroup.selector',
    function () {
      return this.attrs.tower ?
             this.attrs.tower.get('selector') :
             this.attrs.towerGroup.get('selector');
    }
  ),

  actions: {
    selectTower() {
      if (this.attrs['select-tower']) {
        this.attrs['select-tower'](this.attrs.tower);
      }
    },

    selectTowerGroup() {
      if (this.attrs['select-tower-group']) {
        this.attrs['select-tower-group'](this.attrs.towerGroup);
      }
    }
  }
});
