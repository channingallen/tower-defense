import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['stylesheet__block'],

  inputViewName: 'input', // This can be called anything.

  tagName: 'ol',

  _logTGChange: Ember.observer('attrs.selectedTowerGroup', function () {
  }),

  _autoFocusInput: Ember.observer(
    'attrs.selectedTower',
    'attrs.selectedTowerGroup',
    'attrs.tower',
    'attrs.towerGroup',
    function () {
      if (this.attrs.selectedTower &&
          this.attrs.selectedTower === this.attrs.tower) {
        console.log('selected tower changed'); // TODO THIS COMMIT: remove this
        const inputViewName = this.get('inputViewName');
        const inputComponent = this.get(inputViewName);
        const inputEl = inputComponent.get('element');
        inputEl.focus();
      } else if (this.attrs.selectedTowerGroup &&
                 this.attrs.selectedTowerGroup === this.attrs.towerGroup) {
        console.log('selected tower group changed'); // TODO THIS COMMIT: remove this
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
  )
});
