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
    PathCoords.create({ x: 90, y: -5 }),
    PathCoords.create({ x: 90, y: 35 }),
    PathCoords.create({ x: 71, y: 35 }),
    PathCoords.create({ x: 71, y: 10 }),
    PathCoords.create({ x: 90, y: 10 }),
    PathCoords.create({ x: 90, y: 10 }),
    PathCoords.create({ x: 90, y: 50 }),
    PathCoords.create({ x: 40, y: 50 }),
    PathCoords.create({ x: 40, y: 10 }),
    PathCoords.create({ x: 10, y: 10 }),
    PathCoords.create({ x: 10, y: 90 }),
    PathCoords.create({ x: 30, y: 90 }),
    PathCoords.create({ x: 30, y: 70 }),
    PathCoords.create({ x: 105, y: 70 })
  ];

  pathObjects.forEach((pathObject) => {
    board.get('pathData').pushObject(pathObject);
  });

  wave.set('board', board);
}

function addMobsToWave(wave) {
  const mobs = [];

  const mobQuantity = 10;
  for (var i = 0; i < mobQuantity; i++) {
    const newMob = Mob.create({
      id: generateIdForRecord(),
      frequency: 900,
      health: 300,
      maxHealth: 300,
      points: 20,
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
      posY: 'board__tower-group--position-y' + posY,
      selector: 'tower-group-' + groupNum++,
      styles: Ember.A([createUnitCodeLine()])
    });
  }

  const towerGroup1 = getNewTowerGroup(1, 20);
  const towerGroup2 = getNewTowerGroup(5, 70);

  addTowersToTowerGroup(towerGroup1, [{ type: 2 }, { type: 1 }, { type: 1 }]);
  addTowersToTowerGroup(towerGroup2, [{ type: 1 }, { type: 1 }, { type: 2 }]);

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
    newTowers.pushObject(getNewTower(i, specsForTowers.objectAt(i - 1).type));
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
    instructions: {
      main: `This time, each group contains a super tower. Super towers
             deal two times more damage to enemies than normal towers do.
             The only problem is, they aren't effectively arranged in
             their groups!

Enter flex-direction. The flex-direction property defines the directional layout
of the items in the flex container. Flex items can lay out either in horizontal
rows or vertical columns; accordingly, flex-direction accepts the following
values:

* row: lay out items from left to right
* row-reverse: lay out items from right to left
* column: lay out items from top to bottom
* column-reverse: lay out items from bottom to top`,
      tldr: `Use justify-content, align-items, and flex-direction to move your
             towers into effective positions.`
    },
    minimumScore: 80
  });

  addBoardToWave(wave);
  addMobsToWave(wave);
  addTowerGroupsToWave(wave);

  return wave;
}
