import Ember from 'ember';
import createWave1 from 'tower-defense/utils/create-wave-1';
import Game from 'tower-defense/objects/game';

function addWavesToGame(game) {
  const waves = Ember.ArrayProxy.create({ content: Ember.A([]) });
  waves.pushObject(createWave1());
  game.set('waves', waves);
}

export default function createGame() {
  const game = Game.create();

  addWavesToGame(game); // TODO THIS COMMIT: implement this

  return game;
}
