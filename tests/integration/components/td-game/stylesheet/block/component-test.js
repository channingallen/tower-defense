import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('td-game/stylesheet/block', 'Integration | Component | td game/stylesheet/block', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{td-game/stylesheet/block}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#td-game/stylesheet/block}}
      template block text
    {{/td-game/stylesheet/block}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
