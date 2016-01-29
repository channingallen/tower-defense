import Board from 'tower-defense/objects/board';
import createUnitCodeLine from 'tower-defense/utils/create-unit-code-line';
import Ember from 'ember';
import Mob from 'tower-defense/objects/mob';
import PathCoords from 'tower-defense/objects/path-coords';
import TowerGroup from 'tower-defense/objects/tower-group';
import Tower from 'tower-defense/objects/tower';
import Wave from 'tower-defense/objects/wave';

function addBoardToWave(wave) {
  const board = Board.create();
  board.set('imageUrl', '/images/map-3.0.png');

  const pathObjects = [
    PathCoords.create({x: 53, y: -2}),
    PathCoords.create({x: 53, y: 9}),
    PathCoords.create({x: 86, y: 9}),
    PathCoords.create({x: 86, y: 36}),
    PathCoords.create({x: 61, y: 36}),
    PathCoords.create({x: 61, y: 60}),
    PathCoords.create({x: 86, y: 60}),
    PathCoords.create({x: 86, y: 88}),
    PathCoords.create({x: 9, y: 88}),
    PathCoords.create({x: 9, y: 71}),
    PathCoords.create({x: 42, y: 71}),
    PathCoords.create({x: 42, y: 18}),
    PathCoords.create({x: 18, y: 18}),
    PathCoords.create({x: 18, y: 45}),
    PathCoords.create({x: -2, y: 45})
  ];

  pathObjects.forEach((pathObject) => {
    board.get('pathData').pushObject(pathObject);
  });

  wave.set('board', board);
}

function addMobsToWave(wave) {
  const mobs = [];

  const mobQuantity = 1;
  for (var i = 0; i < mobQuantity; i++) {
    const newMob = Mob.create({
      id: generateIdForRecord(),
      frequency: 2000,
      health: 35,
      maxHealth: 35,
      points: 20,
      quantity: mobQuantity,
      speed: 8, // seconds to cross one axis of the board
      type: 'standard'
    });

    mobs.push(newMob);
  }
  wave.set('mobs', Ember.A(mobs));
}

function addTowerGroupsToWave(wave) {
  let groupNum = 1;

  function getNewTowerGroup(numRows, posY) {
    return TowerGroup.create({
      id: generateIdForRecord(),
      numRows: numRows,
      posY: 'board__tower-group--position-y' + posY,
      selector: '.tg' + groupNum++,
      styles: Ember.A([createUnitCodeLine()])
    });
  }

  const towerGroup1 = getNewTowerGroup(1, 27);
  const towerGroup2 = getNewTowerGroup(1, 52);
  const towerGroup3 = getNewTowerGroup(1, 80);

  addTowersToTowerGroup(towerGroup1, 1);
  addTowersToTowerGroup(towerGroup2, 1);
  addTowersToTowerGroup(towerGroup3, 1);

  wave.set('towerGroups', Ember.A([towerGroup1, towerGroup2, towerGroup3]));
}

function addTowersToTowerGroup(towerGroup, numTowers) {
  function getNewTower(towerNum) {
    return Tower.create({
      id: generateIdForRecord(),
      attackPower: 20,
      attackRange: 20,
      selector: 't' + towerNum,
      type: 1,
      styles: Ember.A([createUnitCodeLine()])
    });
  }

  let newTowers = Ember.A([]);
  for (var i = 1; i < numTowers + 1; i++) {
    newTowers.pushObject(getNewTower(i));
  }

  towerGroup.set('towers', newTowers);
}

function generateIdForRecord() {
  function generate4DigitString() {
    const baseInt = Math.floor((1 + Math.random()) * 0x10000);
    return baseInt.toString(16).substring(1);
  }

  return generate4DigitString() + generate4DigitString() + '-' +
         generate4DigitString() + '-' + generate4DigitString() + '-' +
         generate4DigitString() + '-' + generate4DigitString() +
         generate4DigitString() + generate4DigitString();
}

export default function createWave1() {
  const wave = Wave.create({ minimumScore: 20 }); // TODO THIS COMMIT: adjust this

  addBoardToWave(wave);
  addMobsToWave(wave);
  addTowerGroupsToWave(wave);

  return wave;
}
