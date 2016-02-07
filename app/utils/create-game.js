import Ember from 'ember';
import createWave1 from 'tower-defense/utils/create-wave-1';
import createWave2 from 'tower-defense/utils/create-wave-2';
import createWave3 from 'tower-defense/utils/create-wave-3';
import createWave4 from 'tower-defense/utils/create-wave-4';
import createWave5 from 'tower-defense/utils/create-wave-5';
import createWave6 from 'tower-defense/utils/create-wave-6';
import createWave9 from 'tower-defense/utils/create-wave-9';
import createWave10 from 'tower-defense/utils/create-wave-10';
import Game from 'tower-defense/objects/game';

function addWavesToGame(game) {
  const waves = Ember.ArrayProxy.create({ content: Ember.A([]) });

  waves.addObject(createWave1());
  waves.addObject(createWave2());
  waves.addObject(createWave3());
  waves.addObject(createWave4());
  waves.addObject(createWave5());
  waves.addObject(createWave6());
  waves.addObject(createWave9());
  waves.addObject(createWave10());

  game.set('waves', waves);
}

export default function createGame() {
  const game = Game.create();

  addWavesToGame(game); // TODO THIS COMMIT: implement this

  return game;
}
