// const { readFileSync } = require('fs')

// const sample = `.#.#.#.#.#.#.#.#.#.
// ###################
// .#S-------------7#.
// ##|#############|##
// .#|#F---------7#|#.
// ##|#|#########|#|##
// .#|#|#.#.#.#.#|#|#.
// ##|#|#########|#|##
// .#|#|#.#.#.#.#|#|#.
// ##|#|#########|#|##
// .#|#L---7#F---J#|#.
// ##|#####|#|#####|##
// .#|#.#.#|#|#.#.#|#.
// ##|#####|#|#####|##
// .#L-----J#L-----J#.
// ###################
// .#.#.#.#.#.#.#.#.#.`
// let inputArray = sample.split('\n')

// // let startingPosCol = inputArray.findIndex(el => el.indexOf('S') >= 0)
// // let startingPosRow = inputArray[startingPosCol].indexOf('S')

// function doWalk (col, row) {
//   const newInputArray = [...inputArray]
//   function walk (col, row) {
//     if (
//       col < 0 ||
//       row < 0 ||
//       col > newInputArray.length ||
//       row > newInputArray[0].length ||
//       !newInputArray[col] ||
//       !newInputArray[col][row] ||
//       (newInputArray[col][row] !== '.' && newInputArray[col][row] !== '#') ||
//       newInputArray[col][row] === '_'
//     ) {
//       return
//     }

//     let spl = newInputArray[col].split('')
//     spl[row] = '_'
//     newInputArray[col] = spl.join('')
//     walk(col + 1, row)
//     walk(col - 1, row)
//     walk(col, row + 1)
//     walk(col, row - 1)
//   }

//   walk(col, row)
// }
// doWalk(6, 6)
