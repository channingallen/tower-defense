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

  const pathObjects = [
    PathCoords.create({x: 0, y: 30}),
    PathCoords.create({x: 40, y: 30}),
    PathCoords.create({x: 40, y: 10}),
    PathCoords.create({x: 54, y: 10}),
    PathCoords.create({x: 54, y: 60}),
    PathCoords.create({x: 92, y: 60})
  ];

  pathObjects.forEach((pathObject) => {
    board.get('pathData').pushObject(pathObject);
  });

  // TODO THIS COMMIT: give board `imageUrl`
  board.set('imageUrl', '/images/map-1.2-50x50.png');

  wave.set('board', board);
}

// TODO THIS COMMIT: refactor such that mob object isn't made 3 times
//                 - once in mob.js, twice here below
function addMobsToWave(wave) {
  const mobs = [];
  const mobSchemaOne = {
    frequency: 2000,
    health: 300,
    maxHealth: 300,
    points: 20,
    quantity: 1,
    speed: 10, // seconds to cross one axis of the board
    type: 'standard'
  };

  for (var i = 0; i < mobSchemaOne.quantity; i++) {
    const newMob = Mob.create({
      id: generateIdForRecord(),
      frequency: mobSchemaOne.frequency,
      maxHealth: mobSchemaOne.maxHealth,
      health: mobSchemaOne.health,
      points: mobSchemaOne.points,
      quantity: mobSchemaOne.quantity,
      speed: mobSchemaOne.speed,
      type: mobSchemaOne.type
    });

    mobs.push(newMob);
  }
  wave.set('mobs', Ember.A(mobs));
}

// TODO: refactor such that tower groups don't need to be individually defined
function addTowerGroupsToWave(wave) {
  function getNewTowerGroup(groupNum, towerType, posY) {
    return TowerGroup.create({
      id: generateIdForRecord(),
      posY: 'board__tower-group--position-y' + posY,
      selector: '.tg' + groupNum,
      styles: Ember.ArrayProxy.create({ content: Ember.A([createUnitCodeLine()]) }),
      type: towerType
    });
  }

  const towerGroupOne = getNewTowerGroup(1, 1, 15);
  const towerGroupTwo = getNewTowerGroup(2, 3, 65);
  addTowersToTowerGroup(towerGroupOne, 1);
  addTowersToTowerGroup(towerGroupTwo, 3);

  wave.set('towerGroups', Ember.A([
    towerGroupOne,
    towerGroupTwo
  ]));
}

function addTowersToTowerGroup(towerGroup, numTowers) {
  function getNewTower(towerNum) {
    return Tower.create({
      id: generateIdForRecord(),
      attackPower: 20,
      attackRange: 20,
      selector: 't' + towerNum,
      type: 1,
      styles: Ember.ArrayProxy.create({ content: Ember.A([createUnitCodeLine()]) })
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
  const wave = Wave.create({ minimumScore: 3 }); // TODO THIS COMMIT: adjust this

  addBoardToWave(wave);
  addMobsToWave(wave);
  addTowerGroupsToWave(wave);

  return wave;
}
