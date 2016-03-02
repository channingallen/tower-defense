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
  board.set('imageUrl', '/images/path-9.png');

  const pathObjects = [
    PathCoords.create({ x: 10, y: -3 }),
    PathCoords.create({ x: 10, y: 30 }),
    PathCoords.create({ x: 90, y: 30 }),
    PathCoords.create({ x: 90, y: 10 }),
    PathCoords.create({ x: 70, y: 10 }),
    PathCoords.create({ x: 70, y: 50 }),
    PathCoords.create({ x: 30, y: 50 }),
    PathCoords.create({ x: 30, y: 90 }),
    PathCoords.create({ x: 10, y: 90 }),
    PathCoords.create({ x: 10, y: 70 }),
    PathCoords.create({ x: 90, y: 70 }),
    PathCoords.create({ x: 90, y: 103 })
  ];

  pathObjects.forEach((pathObject) => {
    board.get('pathData').addObject(pathObject);
  });

  wave.set('board', board);
}

function addMobsToWave(wave) {
  const mobs = [];

  const mobQuantity = 25;
  for (var i = 0; i < mobQuantity; i++) {
    const newMob = Mob.create({
      id: generateIdForRecord(),
      frequency: 700,
      health: 300,
      maxHealth: 300,
      points: 4,
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

  const towerGroup1 = getNewTowerGroup(1, 17);
  const towerGroup2 = getNewTowerGroup(1, 77);

  addTowersToTowerGroup(towerGroup1, [{ type: 1 }, { type: 2 }, { type: 1 }]);
  addTowersToTowerGroup(towerGroup2, [{ type: 1 }, { type: 2 }, { type: 1 }]);

  wave.set('towerGroups', Ember.A([towerGroup1, towerGroup2]));
}

function addTowersToTowerGroup(towerGroup, specsForTowers) {
  function getNewTower(towerNum, type) {
    return Tower.create({
      id: generateIdForRecord(),
      attackPower: 20,
      attackRange: 20,
      selector: `tower-${towerGroup.get('groupNum')}-${towerNum}`,
      type,
      styles: Ember.A([createUnitCodeLine()])
    });
  }

  let newTowers = [];
  for (var i = 1; i < specsForTowers.length + 1; i++) {
    newTowers.addObject(getNewTower(i, specsForTowers.objectAt(i - 1).type));
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

export default function createWave9() {
  const wave = Wave.create({
    towerStylesHidden: false,
    instructions: {
      main: `The super towers are in bad positions again, but this time you'll
             need to apply styles to the towers themselves.

The \`order\` property defines the order in which an item appears in the flex
container and accepts both positive and negative integer values. All flex items
begin with a default order of 0, so an item with an order greater than 0 will
be repositioned relative to items still set to their default orders.

Use \`justify-content\` and \`order\` to move your towers into position.

**justify-content**
* \`flex-start\`: group items in the left (the start) of a container
* \`flex-end\`: group items in the right of a container
* \`center\`: group items in the center of a container
* \`space-between\`: evenly distribute items in a container such that the first
item aligns to the left and the final item aligns to the right
* \`space-around\`: evenly distribute items in a container such that all items
have equal space around them

**order**
* \`#\`: position an item relative to the other items in the container`,
    tldr: `Move your towers into position by combining the container properties
           \`justify-content\` and \`align-items\` with the item property
           \`order\`. Remember that all items have a default order of 0.`
    },
    minimumScore: 80
  });

  addBoardToWave(wave);
  addMobsToWave(wave);
  addTowerGroupsToWave(wave);

  return wave;
}
