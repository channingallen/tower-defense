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
    // PathCoords.create({x: 100, y: 50}),
    // PathCoords.create({x: 90, y: 50}),
    // PathCoords.create({x: 80, y: 50}),
    // PathCoords.create({x: 80, y: 40}),
    // PathCoords.create({x: 80, y: 30}),
    // PathCoords.create({x: 80, y: 20}),
    // PathCoords.create({x: 70, y: 20}),
    // PathCoords.create({x: 60, y: 20}),
    // PathCoords.create({x: 50, y: 20}),
    // PathCoords.create({x: 40, y: 20}),
    // PathCoords.create({x: 40, y: 30}),
    // PathCoords.create({x: 40, y: 40}),
    // PathCoords.create({x: 40, y: 50}),
    // PathCoords.create({x: 40, y: 60}),
    // PathCoords.create({x: 40, y: 70}),
    // PathCoords.create({x: 40, y: 80}),
    // PathCoords.create({x: 40, y: 90}),
    // PathCoords.create({x: 50, y: 90}),
    // PathCoords.create({x: 60, y: 90}),
    // PathCoords.create({x: 70, y: 90}),
    // PathCoords.create({x: 80, y: 90}),
    // PathCoords.create({x: 80, y: 100})
    //
    PathCoords.create({x: 100, y: 10}),
    PathCoords.create({x: 90, y: 10}),
    PathCoords.create({x: 80, y: 10}),
    PathCoords.create({x: 70, y: 10}),
    PathCoords.create({x: 60, y: 10}),
    PathCoords.create({x: 50, y: 10}),
    PathCoords.create({x: 40, y: 10}),
    PathCoords.create({x: 30, y: 10}),
    PathCoords.create({x: 20, y: 10}),
    PathCoords.create({x: 10, y: 10})
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
    speed: 2000,
    type: 'standard'
  };

  for (var i = 0; i < mobSchemaOne.quantity; i++) {
    const newMob = Mob.create({
      id: generateIdForRecord(),
      frequency: mobSchemaOne.frequency,
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
  function getNewTowerGroup(groupNum, posY) {
    return TowerGroup.create({
      id: generateIdForRecord(),
      posY: posY,
      selector: '.t-g-' + groupNum,
      styles: Ember.A([createUnitCodeLine()])
    });
  }

  const towerGroupOne = getNewTowerGroup(1, 0);
  const towerGroupTwo = getNewTowerGroup(2, 50);
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
