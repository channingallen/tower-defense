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
//           id: null,
//           codeLine: undefined
//           submitted: false,
//         }
//       ],
//       towers: [
//         tower: {
//           selector: '.tower',
//           styles: [
//             {
//               id: null,
//               codeLine: undefined,
//               submitted: false
//             }
//           ],
//           type: 1
//         }
//       ]
//     }
//   ]
// }
