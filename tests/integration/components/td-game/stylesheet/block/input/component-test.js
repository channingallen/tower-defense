import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('td-game/stylesheet/block/input', 'Integration | Component | td game/stylesheet/block/input', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{td-game/stylesheet/block/input}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#td-game/stylesheet/block/input}}
      template block text
    {{/td-game/stylesheet/block/input}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
