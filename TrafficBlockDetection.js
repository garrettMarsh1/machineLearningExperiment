<<<<<<< Updated upstream
// /**
//  * Returns true if (x, y) is contained within the rectangle defined by the given bounds
//  * @param {number} x 
//  * @param {number} y 
//  * @param {number} left_bound 
//  * @param {number} right_bound 
//  * @param {number} upper_bound 
//  * @param {number} lower_bound
//  * @returns {boolean}
=======


/**
 * Returns true if (x, y) is contained within the rectangle defined by the given bounds
 * @param {number} x 
 * @param {number} y 
 * @param {number} left_bound 
 * @param {number} right_bound 
 * @param {number} upper_bound 
 * @param {number} lower_bound
 * @returns {boolean}
>>>>>>> Stashed changes

//  */
//  function pointInBounds(x, y, left_bound, right_bound, upper_bound, lower_bound) {
//     return (x > left_bound && x < right_bound && y > lower_bound && y < upper_bound)
// }

// /**
//  * return an array of all traffic that overlaps the specified bounds
//  * @param {Traffic[]} trafficCollection 
//  * @param {number} x 
//  * @param {number} y 
//  * @param {number} width 
//  * @param {number} height 
//  * @returns {Traffic[]} array of traffic overlapping with the specified bounds
//  */
// function getTrafficInBounds(trafficCollection, x, y, width, height) {

//     // I'm assuming traffic starts at x, y and grows to the right and up with width and height
//     // you may need to adjust if I'm wrong about that
//     let left_bound = x;
//     let right_bound = x + width;
//     let upper_bound = y + height;
//     let lower_bound = y;
//     let overlappingTraffic = [];
//     for (let trafficItem in trafficCollection) {
//         let overlaps = false;
//         // to determine if trafficItem overlaps with the given bounds, 
//         // check if any corners start in the bounds then if the object
//         // encompasses the bounds (bigger than bounds)

//         // bottom left
//         overlaps = overlaps || pointInBounds(trafficItem.x, trafficItem.y, left_bound, right_bound, upper_bound, lower_bound);
//         // bottom right
//         overlaps = overlaps || pointInBounds(trafficItem.x + trafficItem.width, trafficItem.y, left_bound, right_bound, upper_bound, lower_bound);
//         // top left
//         overlaps = overlaps || pointInBounds(trafficItem.x, trafficItem.y + trafficItem.height, left_bound, right_bound, upper_bound, lower_bound);
//         // top right
//         overlaps = overlaps || pointInBounds(trafficItem.x + trafficItem.width, trafficItem.y + trafficItem.height, left_bound, right_bound, upper_bound, lower_bound);
//         // x dim encompasses
//         overlaps = overlaps || trafficItem.x < left_bound && trafficItem.x + trafficItem.width > right_bound;
//         // y dim encompasses
//         overlaps = overlaps || trafficItem.y < lower_bound && trafficItem.y + trafficItem.height > upper_bound;

//         if (overlaps) {
//             overlappingTraffic.push(trafficItem)
//         }
//     }
//     return overlappingTraffic;
    
// }

// /**
//  * Determine if adding a new traffic element would block the road within the lanes x 3 grid starting at verticalStart.
//  * Helper function for willTrafficBlock
//  * @param {road}

//  * @param {Traffic[]} trafficCollection existing traffic
//  * @param {Traffic} trafficItem new candidate traffic to check
//  * @param {number} carSize vertical size of a player car
//  * @param {number} verticalStart lower edge of grid to consider
//  */
//  function willTrafficBlockInGrid(road, trafficCollection, trafficItem, carSize, trafficSize, verticalStart) {
//     // NOTE this would probably go better as a function in Road, but defining
//     // here to keep my changes all together
//     let laneWidth = road.width / road.laneCount;
//     let getLaneStart = (laneIndex) => road.left + laneWidth * laneIndex;

//     // just defining starting points of grid (bottom leftmost points)
//     let grid = [];
//     //iterate over vertical dims
//     for (let y = 0; y < 3; y += 1) {
//         let column = []
//         // iterate over horizontal (lane) dim
//         for (let x = 0; x < road.laneCount; x += 1) {
//             let x_start = getLaneStart(x);
//             let y_start = verticalStart + y * carSize;
//             let tyStart = verticalStart + y * trafficSize;
//             column.push([x_start, y_start]);
//         }
//         grid.push(column)
//     }

//     // check if there is any column free of obstructions
//     let gridUnobstructed = false;
    
//     for (let column in grid) {
//         let columnUnobstructed = true;
//         for (let point in column) {
//             let trafficInSquare = getTrafficInBounds(
//                 trafficCollection.concat(trafficItem), // add to trafficCollection without changing original
//                 x = point[0],
//                 y = point[1],
//                 laneWidth,
//                 carSize
//             );
//             //console.log(trafficInSquare)
//             // if there are any squares in this grid square, the column cannot be clear
//             if (trafficInSquare.length > 0) {
//                 columnUnobstructed = false;
//                 break;
//             }
//         }
//         // the grid is clear iff the column is clear
//         if (columnUnobstructed) {
//             gridUnobstructed = true;
//             break;
//         }
        
//     }

//     return gridUnobstructed;
    
// }

// /**
//  * Determine if adding a new traffic element would block the road. Assumes the player car is thinner than the lane width
//  * @param {road}

//  * @param {Traffic[]} trafficCollection existing traffic
//  * @param {Traffic} trafficItem new candidate traffic to check
//  * @param {number} carSize vertical size of a player car
//  */
// function willTrafficBlock(road, trafficCollection, trafficItem, carSize, ) {
//     // this trafficItem can only affect the (lanes x 3) size grid squares containing it,
//     // so just check if all three of those are unobstructed
    
//     // check the grid starting 2 cars below the new traffic item (where new traffic is in the top row)
//     let lowerGridStart = trafficItem.y - 2 * carSize;
//     let trafficBlocksGrid1 = willTrafficBlockInGrid(
//         road,
//         trafficCollection,
//         trafficItem,
//         carSize,
//         lowerGridStart
//     );
//     // check the grid starting 1 cars below the new traffic item (where new traffic is in the middle row)
//     let middleGridStart = trafficItem.y - 1 * carSize;
//     let trafficBlocksGrid2 = willTrafficBlockInGrid(
//         road,
//         trafficCollection,
//         trafficItem,
//         carSize,
//         middleGridStart
//     );
//     // check the grid starting at the bottom of the new traffic item (where new traffic is in the bottom row)
//     let upperGridStart = trafficItem.y;
//     let trafficBlocksGrid3 = willTrafficBlockInGrid(
//         road,
//         trafficCollection,
//         trafficItem,
//         carSize,
//         upperGridStart
//     );

//     //NOTE: the following is unnecessary if traffic cannot be taller than carSize
//     if (trafficItem.height > carSize) {
//         // how many additional grids on top of the three to check for
//         // (when trafficItem doesn't start in the grid but ends in it)
//         let extraGrids = Math.ceil(trafficItem.height / carSize) - 1;

//         for (let i = 0; i < extraGrids; i += 1) {
//             let extraGridStart = trafficItem.y + i * carSize;
//             let trafficBlocksExtraGrid = willTrafficBlockInGrid(
//                 road,
//                 trafficCollection,
//                 trafficItem,
//                 carSize,
//                 extraGridStart
//             );
//             if (trafficBlocksExtraGrid) {
//                 return true;
//             }
//             //console.log(traffic)
            
//         }
//     }

//     return trafficBlocksGrid1 || trafficBlocksGrid2 || trafficBlocksGrid3
    
// }