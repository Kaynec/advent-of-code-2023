const { readFileSync } = require('fs')

let inputArray = readFileSync('input', 'utf-8').split('\r\n')

let startingPosCol = inputArray.findIndex(el => el.indexOf('S') >= 0)
let startingPosRow = inputArray[startingPosCol].indexOf('S')

const directions = {
  TOP: {
    chars: ['7', 'F', 'J', '|'],
    dir: [-1, 0]
  },
  RIGHT: {
    chars: ['-', '7', 'J'],
    dir: [0, +1]
  },
  LEFT: {
    chars: ['-', 'L', 'F'],
    dir: [0, -1]
  },
  TOP: {
    chars: ['7', 'F', 'L', '|'],
    dir: [+1, 0]
  }
}

function findAdjacentElements (col, row) {
  return Object.keys(directions).reduce((total, curr) => {
    const { chars, dir } = directions[curr]
    const [dirCol, dirRow] = dir
    const [newCol, newRow] = [col + dirCol, row + dirRow]
    const newChar = inputArray[newCol][newRow]
    const isAdjacent = chars.includes(newChar)
    if (isAdjacent) total.push([newCol, newRow])
    return total
  }, [])
}

let step = 0

const CharDirs = {
  J: {
    checkArrTrue: [-1, 0],
    checkArrFalse: [0, -1]
  },
  L: {
    checkArrTrue: [-1, 0],
    checkArrFalse: [0, 1]
  },
  '|': {
    checkArrTrue: [+1, 0],
    checkArrFalse: [-1, 0]
  },
  F: {
    checkArrTrue: [0, +1],
    checkArrFalse: [+1, 0]
  },
  '-': {
    checkArrTrue: [0, -1],
    checkArrFalse: [0, +1]
  },
  7: {
    checkArrTrue: [+1, 0],
    checkArrFalse: [0, -1]
  }
}

function pathMove (col, row) {
  let curCol = col
  let curRow = row
  let currentEl = inputArray[curCol][curRow]
  const isNotVisited = (col = curCol, row = curRow) =>
    !visited.some(([elc, elr]) => elc === col && elr === row) &&
    inputArray[col][row] !== 'S'

  function updateCordinates (col, row) {
    if (!visited.find(([elc, elr]) => elc === curCol && elr === curRow))
      visited.push([curCol, curRow])
    curCol = col ?? curCol
    curRow = row ?? curRow
    return [curCol, curRow]
  }

  const ObjectElement = CharDirs[currentEl]
  const { checkArrFalse, checkArrTrue } = ObjectElement

  if (!isNotVisited(checkArrTrue[0], checkArrTrue[1]))
    return updateCordinates(checkArrTrue[0], checkArrTrue[1])
  return updateCordinates(checkArrFalse[0] + curCol, checkArrFalse[1] + curRow)
}

let element = null

const startingPaths = findAdjacentElements(startingPosCol, startingPosRow)

let [firstPath, secondPath] = startingPaths
let [fircol, firrow] = firstPath
let [seccol, secrow] = secondPath
const visited = []

while (!element) {
  ;[fircol, firrow] = pathMove(fircol, firrow)
  ;[seccol, secrow] = pathMove(seccol, secrow)

  if (fircol === seccol && firrow === secrow) element = [fircol, firrow]
  step++
}
console.log(element, (step += 1))
