import Board from '../objects/board';
import createUnitCodeLine from 'tower-defense/utils/create-unit-code-line';
import Ember from 'ember';
import Mob from '../objects/mob';
import PathCoords from '../objects/path-coords';
import TowerGroup from '../objects/tower-group';
import Tower from '../objects/tower';
import Wave from '../objects/wave';

function addBoardToWave(wave) {
  const board = Board.create();
  const ptA = PathCoords.create({x: 1, y: 1});
  const ptB = PathCoords.create({x: 1, y: 2});
  const ptC = PathCoords.create({x: 1, y: 3});
  const ptD = PathCoords.create({x: 1, y: 4});
  const ptE = PathCoords.create({x: 1, y: 5});
  const ptF = PathCoords.create({x: 1, y: 6});
  const ptG = PathCoords.create({x: 1, y: 7});
  const ptH = PathCoords.create({x: 1, y: 8});
  const ptI = PathCoords.create({x: 1, y: 9});
  board.pathData.pushObject(ptA);
  board.pathData.pushObject(ptB);
  board.pathData.pushObject(ptC);
  board.pathData.pushObject(ptD);
  board.pathData.pushObject(ptE);
  board.pathData.pushObject(ptF);
  board.pathData.pushObject(ptG);
  board.pathData.pushObject(ptH);
  board.pathData.pushObject(ptI);

  // TODO THIS COMMIT: give board `imageUrl`
  wave.set('board', board);
}

function addMobsToWave(wave) {
  const mob = Mob.create();
  mob.set('frequency', 3000); // TODO THIS COMMIT: adjust this
  mob.set('maxHealth', 100); // TODO THIS COMMIT: adjust this
  mob.set('points', 1); // TODO THIS COMMIT: adjust this
  mob.set('quantity', 10); // TODO THIS COMMIT: adjust this
  mob.set('speed', 1); // TODO THIS COMMIT: adjust this
  mob.set('type', 'standard'); // TODO THIS COMMIT: adjust this

  wave.set('mobs', Ember.A([mob]));
}

function addTowerGroupsToWave(wave) {
  const towerGroupOne = TowerGroup.create();
  const towerOne = Tower.create();
  const towerTwo = Tower.create();
  const towerThree = Tower.create();

  towerOne.set('selector', '.t-1'); // TODO THIS COMMIT: adjust this;
  towerOne.set('type', 1); // TODO THIS COMMIT: adjust this;
  towerOne.set('styles', Ember.A([createUnitCodeLine()]));

  towerTwo.set('selector', '.t-2'); // TODO THIS COMMIT: adjust this;
  towerTwo.set('type', 1); // TODO THIS COMMIT: adjust this;
  towerTwo.set('styles', Ember.A([createUnitCodeLine()]));

  towerThree.set('selector', '.t-3'); // TODO THIS COMMIT: adjust this;
  towerThree.set('type', 1); // TODO THIS COMMIT: adjust this;
  towerThree.set('styles', Ember.A([createUnitCodeLine()]));

  towerGroupOne.set('selector', '.t-g-1');
  towerGroupOne.set('towers', [towerOne, towerTwo, towerThree]);
  towerGroupOne.set('styles', Ember.A([createUnitCodeLine()]));

  const towerGroupTwo = TowerGroup.create();
  const towerFour = Tower.create();
  const towerFive = Tower.create();
  const towerSix = Tower.create();

  towerFour.set('selector', '.t-4'); // TODO THIS COMMIT: adjust this;
  towerFour.set('type', 1); // TODO THIS COMMIT: adjust this;
  towerFour.set('styles', Ember.A([createUnitCodeLine()]));

  towerFive.set('selector', '.t-5'); // TODO THIS COMMIT: adjust this;
  towerFive.set('type', 1); // TODO THIS COMMIT: adjust this;
  towerFive.set('styles', Ember.A([createUnitCodeLine()]));

  towerSix.set('selector', '.t-6'); // TODO THIS COMMIT: adjust this;
  towerSix.set('type', 1); // TODO THIS COMMIT: adjust this;
  towerSix.set('styles', Ember.A([createUnitCodeLine()]));

  towerGroupTwo.set('selector', '.t-g-2');
  towerGroupTwo.set('towers', [towerFour, towerFive, towerSix]);
  towerGroupTwo.set('styles', Ember.A([createUnitCodeLine()]));

  wave.set('towerGroups', [towerGroupOne, towerGroupTwo]);
}

export default function createWave() {
  const wave = Wave.create({ minimumScore: 3 }); // TODO THIS COMMIT: adjust this

  addBoardToWave(wave);
  addMobsToWave(wave);
  addTowerGroupsToWave(wave);

  return wave;
}
