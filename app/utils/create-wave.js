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

  const pathObjects = [
    PathCoords.create({x: 10, y: 5}),
    PathCoords.create({x: 9, y: 5}),
    PathCoords.create({x: 8, y: 5}),
    PathCoords.create({x: 8, y: 4}),
    PathCoords.create({x: 8, y: 3}),
    PathCoords.create({x: 8, y: 2}),
    PathCoords.create({x: 7, y: 2}),
    PathCoords.create({x: 6, y: 2}),
    PathCoords.create({x: 5, y: 2}),
    PathCoords.create({x: 4, y: 2}),
    PathCoords.create({x: 4, y: 3}),
    PathCoords.create({x: 4, y: 4}),
    PathCoords.create({x: 4, y: 5}),
    PathCoords.create({x: 4, y: 6}),
    PathCoords.create({x: 4, y: 7}),
    PathCoords.create({x: 4, y: 8}),
    PathCoords.create({x: 4, y: 9}),
    PathCoords.create({x: 5, y: 9}),
    PathCoords.create({x: 6, y: 9}),
    PathCoords.create({x: 7, y: 9}),
    PathCoords.create({x: 8, y: 9}),
    PathCoords.create({x: 8, y: 10})
  ];

  pathObjects.forEach((pathObject) => {
    board.pathData.pushObject(pathObject);
  });

  // TODO THIS COMMIT: give board `imageUrl`
  wave.set('board', board);
}

// TODO THIS COMMIT: refactor such that mob object isn't made 3 times
//                 - once in mob.js, twice here below
function addMobsToWave(wave) {
  const mobs = [];
  const mobSchemaOne = {
    frequency: 3000,
    health: 100,
    points: 1,
    quantity: 5,
    speed: 1000,
    type: 'standard'
  };

  for (var i = 0; i < mobSchemaOne.quantity; i++) {
    const newMob = Mob.create({
      id: generateIdForRecord(),
      frequency: mobSchemaOne.frequency,
      health: mobSchemaOne.health,
      number: i + 1,
      points: mobSchemaOne.points,
      quantity: mobSchemaOne.quantity,
      speed: mobSchemaOne.speed,
      type: mobSchemaOne.type
    });

    mobs.push(newMob);
  }
  wave.set('mobs', Ember.A(mobs));
}

function addTowerGroupsToWave(wave) {
  function getNewTowerGroup(groupNum) {
    return TowerGroup.create({
      id: generateIdForRecord(),
      selector: '.t-g-' + groupNum,
      styles: Ember.A([createUnitCodeLine()])
    });
  }

  const towerGroupOne = getNewTowerGroup(1);
  const towerGroupTwo = getNewTowerGroup(2);
  addTowersToTowerGroup(towerGroupOne, 3);
  addTowersToTowerGroup(towerGroupTwo, 3);

  wave.set('towerGroups', Ember.A([towerGroupOne, towerGroupTwo]));
}

function addTowersToTowerGroup(towerGroup, numTowers) {
  function getNewTower(towerNum) {
    return Tower.create({
      id: generateIdForRecord(),
      selector: 't-' + towerNum,
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

export default function createWave() {
  const wave = Wave.create({ minimumScore: 3 }); // TODO THIS COMMIT: adjust this

  addBoardToWave(wave);
  addMobsToWave(wave);
  addTowerGroupsToWave(wave);

  return wave;
}
