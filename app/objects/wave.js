import Ember from 'ember';

const Wave = Ember.Object.extend({
  board: null,
  minimumScore: null,
  mobs: null,
  towerGroups: null
});

export default Wave;

// wave (default after creation):
// {
//   board: {
//     imageUrl: null,
//     pathData: null
//   },
//   minimumScore: 3,
//   mobs: [
//     mob: {
//       maxHealth: 100,
//       points: 1,
//       quantity: 10,
//       speed: 1,
//       type: 'standard'
//     }
//   ],
//   towerGroups: [
//     towerGroup: {
//       selector: '.tower-group',
//       styles: [
//         {
//           codeLine: undefined,
//           submitted: false,
//           id: null,
//           unitType: null
//         }
//       ],
//       towers: [
//         tower: {
//           selector: '.tower',
//           styles: [
//             {
//               codeLine: undefined,
//               submitted: false,
//               id: null,
//               unitType: null
//             }
//           ],
//           type: 1
//         }
//       ]
//     }
//   ]
// }
