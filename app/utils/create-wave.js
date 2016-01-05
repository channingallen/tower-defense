import Board from '../objects/board';
import createUnitCodeLine from 'tower-defense/utils/create-unit-code-line';
import Ember from 'ember';
import Mob from '../objects/mob';
import TowerGroup from '../objects/tower-group';
import Tower from '../objects/tower';
import Wave from '../objects/wave';

function addBoardToWave(wave) {
  const board = Board.create();
  // TODO THIS COMMIT: give board `imageUrl`
  // TODO THIS COMMIT: give board `pathData`
  wave.set('board', board);
}

function addMobsToWave(wave) {
  const mob = Mob.create();
  mob.set('maxHealth', 100); // TODO THIS COMMIT: adjust this
  // TODO THIS COMMIT: set mob `path`
  mob.set('points', 1); // TODO THIS COMMIT: adjust this
  mob.set('quantity', 10); // TODO THIS COMMIT: adjust this
  mob.set('speed', 1); // TODO THIS COMMIT: adjust this
  mob.set('type', 'standard'); // TODO THIS COMMIT: adjust this

  wave.set('mobs', [mob]);
}

function addTowerGroupsToWave(wave) {
  const towerGroup = TowerGroup.create();
  const tower = Tower.create();

  tower.set('type', 1); // TODO THIS COMMIT: adjust this;
  tower.set('styles', Ember.A([createUnitCodeLine()]));

  towerGroup.set('towers', [tower]);
  towerGroup.set('styles', Ember.A([createUnitCodeLine()]));

  wave.set('towerGroups', [towerGroup]);
}

export default function createWave() {
  const wave = Wave.create({ minimumScore: 3 }); // TODO THIS COMMIT: adjust this

  addBoardToWave(wave);
  addMobsToWave(wave);
  addTowerGroupsToWave(wave);

  return wave;
}
