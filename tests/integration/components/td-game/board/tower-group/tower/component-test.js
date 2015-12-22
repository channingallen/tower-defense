import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('td-game/board/tower-group/tower', 'Integration | Component | td game/board/tower group/tower', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{td-game/board/tower-group/tower}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#td-game/board/tower-group/tower}}
      template block text
    {{/td-game/board/tower-group/tower}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
