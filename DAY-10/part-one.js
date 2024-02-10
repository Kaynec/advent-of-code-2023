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
  const paths = []

  for (let key of Object.keys(directions)) {
    const { chars, dir } = directions[key]
    const [dirCol, dirRow] = dir
    const [newCol, newRow] = [col + dirCol, row + dirRow]
    const newChar = inputArray[newCol][newRow]
    const isAdjacent = chars.includes(newChar)
    if (isAdjacent) paths.push([newCol, newRow])
  }

  return paths
}

const startingPaths = findAdjacentElements(startingPosCol, startingPosRow)

let [firstPath, secondPath] = startingPaths
let [fircol, firrow] = firstPath
let [seccol, secrow] = secondPath
const visited = []

let step = 0

function pathMove (col, row) {
  let curCol = col
  let curRow = row
  let currentEl = inputArray[curCol][curRow]
  const findIfVisited = (col = curCol, row = curRow) =>
    visited.some(([elc, elr]) => elc === col && elr === row) ??
    inputArray[col][row] === 'S'

  function updateCordinates (col, row) {
    if (!visited.find(([elc, elr]) => elc === curCol && elr === curRow))
      visited.push([curCol, curRow])
    curCol = col ?? curCol
    curRow = row ?? curRow
    return [curCol, curRow]
  }

  if (currentEl === '|') {
    if (findIfVisited(curCol + 1, curRow)) return updateCordinates(curCol - 1)
    return updateCordinates(curCol + 1)
  }
  if (currentEl === 'L') {
    if (findIfVisited(curCol - 1, curRow))
      return updateCordinates(curCol, curRow + 1)
    return updateCordinates(curCol - 1)
  }
  if (currentEl === 'J') {
    if (findIfVisited(curCol, curRow - 1)) return updateCordinates(curCol - 1)
    return updateCordinates(curCol, curRow - 1)
  }
  if (currentEl === 'F') {
    if (findIfVisited(curCol, curRow + 1)) return updateCordinates(curCol + 1)
    return updateCordinates(curCol, curRow + 1)
  }
  if (currentEl === '-') {
    if (findIfVisited(curCol, curRow - 1))
      return updateCordinates(curCol, curRow + 1)
    return updateCordinates(curCol, curRow - 1)
  }
  if (currentEl === '7') {
    if (findIfVisited(curCol + 1, curRow))
      return updateCordinates(curCol, curRow - 1)
    return updateCordinates(curCol + 1)
  }
}

let element = null

while (!element) {
  ;[fircol, firrow] = pathMove(fircol, firrow)
  ;[seccol, secrow] = pathMove(seccol, secrow)

  if (fircol === seccol && firrow === secrow) element = [fircol, firrow]
  step++
}
console.log(element, (step += 1))
