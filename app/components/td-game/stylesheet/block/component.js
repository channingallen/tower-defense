import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['stylesheet__block'],

  inputViewName: 'input', // This can be called anything.

  tagName: 'ol',

  _autoFocusInput: Ember.observer(
    'attrs.selectedTowerGroup',
    'attrs.towerGroup',
    function () {
      if (this.attrs.selectedTowerGroup === this.attrs.towerGroup) {
        if (this.attrs.tower) {
          return;
        }
        const inputViewName = this.get('inputViewName');
        const inputComponent = this.get(inputViewName);
        const inputEl = inputComponent.get('element');
        inputEl.focus();
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
    selectTowerAndGroup() {
      alert('you clicked a Tower!');
    },

    selectTowerGroup() {
      alert('you clicked a Tower Group!');
    }
  }
});
