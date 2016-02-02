import Ember from 'ember';
import createWave1 from 'tower-defense/utils/create-wave-1';
import createWave2 from 'tower-defense/utils/create-wave-2';
// import createWave3 from 'tower-defense/utils/create-wave-3';
import createWave9 from 'tower-defense/utils/create-wave-9';
import createWave10 from 'tower-defense/utils/create-wave-10';
import Game from 'tower-defense/objects/game';

function addWavesToGame(game) {
  const waves = Ember.ArrayProxy.create({ content: Ember.A([]) });

  waves.pushObject(createWave1());
  waves.pushObject(createWave2());
  // waves.pushObject(createWave3());
  waves.pushObject(createWave9());
  waves.pushObject(createWave10());

  game.set('waves', waves);
}

export default function createGame() {
  const game = Game.create();

  addWavesToGame(game); // TODO THIS COMMIT: implement this

  return game;
}
