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
  board.set('imageUrl', '/images/path-5.png');

  const pathObjects = [
    PathCoords.create({ x: 5, y: -3 }),
    PathCoords.create({ x: 5, y: 25 }),
    PathCoords.create({ x: 35, y: 25 }),
    PathCoords.create({ x: 35, y: 40 }),
    PathCoords.create({ x: 65, y: 40 }),
    PathCoords.create({ x: 65, y: 25 }),
    PathCoords.create({ x: 90, y: 25 }),
    PathCoords.create({ x: 90, y: 75 }),
    PathCoords.create({ x: 35, y: 75 }),
    PathCoords.create({ x: 35, y: 103 })
  ];

  pathObjects.forEach((pathObject) => {
    board.get('pathData').addObject(pathObject);
  });

  wave.set('board', board);
}

function addMobsToWave(wave) {
  const mobs = [];

  const mobQuantity = 10;
  for (var i = 0; i < mobQuantity; i++) {
    const newMob = Mob.create({
      id: generateIdForRecord(),
      frequency: 1500,
      health: 220,
      maxHealth: 220,
      points: 10,
      quantity: mobQuantity,
      speed: 10, // seconds to cross one axis of the board
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
      groupNum,
      numRows,
      posY,
      selector: 'tower-group-' + groupNum++,
      styles: Ember.A([createUnitCodeLine()])
    });
  }

  const towerGroup1 = getNewTowerGroup(3, 4);
  const towerGroup2 = getNewTowerGroup(1, 46);
  const towerGroup3 = getNewTowerGroup(3, 60);

  addTowersToTowerGroup(towerGroup1, 2);
  addTowersToTowerGroup(towerGroup2, 1);
  addTowersToTowerGroup(towerGroup3, 2);

  wave.set('towerGroups', Ember.A([towerGroup1, towerGroup2, towerGroup3]));
}

function addTowersToTowerGroup(towerGroup, numTowers) {
  function getNewTower(towerNum) {
    return Tower.create({
      id: generateIdForRecord(),
      attackPower: 20,
      attackRange: 20,
      selector: `tower-${towerGroup.get('groupNum')}-${towerNum}`,
      type: 1,
      styles: Ember.A([createUnitCodeLine()])
    });
  }

  let newTowers = Ember.A([]);
  for (var i = 1; i < numTowers + 1; i++) {
    newTowers.addObject(getNewTower(i));
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

export default function createWave5() {
  const wave = Wave.create({
    towerStylesHidden: true,
    instructions: {
      main: `This time things are a bit trickier. Try combining
            \`justify-content\` and \`align-items\` to score 80 or higher!

**justify-content**
* \`flex-start\`: group items in the left (the start) of a container
* \`flex-end\`: group items in the right of a container
* \`center\`: group items in the horizontal center of a container
* \`space-between\`: evenly distribute items in a container such that the first item
aligns to the left and the final item aligns to the right
* \`space-around\`: evenly distribute items in a container such that all items have
equal space around them

**align-items**
* \`flex-start\`: align items across the top of the container
* \`flex-end\`: align items across the bottom of the container
* \`center\`: align items vertically across the center of the container
* \`baseline\`: align items across the baseline of the container
* \`stretch\`: stretch items to fill the container`,
      tldr: `Use \`justify-content\` and \`align-items\` to move your towers
             into position.`
    },
    minimumScore: 80
  });

  addBoardToWave(wave);
  addMobsToWave(wave);
  addTowerGroupsToWave(wave);

  return wave;
}
