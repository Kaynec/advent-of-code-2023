const { readFileSync } = require('fs')
const { connect } = require('http2')

let inputArray = readFileSync('sample', 'utf-8').split('\r\n')

let startingPosCol = inputArray.findIndex(el => el.indexOf('S') >= 0)
let startingPosRow = inputArray[startingPosCol].indexOf('S')

const directions = {
  TOP: {
    chars: ['7', 'F', 'J', '|'],
    dir: [-1, 0]
  },
  BOTTOM: {
    chars: ['7', 'F', 'L', '|'],
    dir: [+1, 0]
  },
  RIGHT: {
    chars: ['-', '7', 'J'],
    dir: [0, +1]
  },
  LEFT: {
    chars: ['-', 'L', 'F'],
    dir: [0, -1]
  }
}

function findAdjacentElements (col, row) {
  const paths = []

  for (let key of Object.keys(directions)) {
    const { chars, dir } = directions[key]
    const [dirCol, dirRow] = dir
    const [newCol, newRow] = [col + dirCol, row + dirRow]
    const newChar = !!inputArray[newCol] ? inputArray[newCol][newRow] : 'NULL'
    const isAdjacent = chars.includes(newChar)
    if (isAdjacent) paths.push([newCol, newRow])
  }

  return paths
}

const startingPaths = findAdjacentElements(startingPosCol, startingPosRow)

let [firstPath, secondPath] = startingPaths
let [fircol, firrow] = firstPath
let [seccol, secrow] = secondPath
const visited = [[startingPosCol, startingPosRow]]

let step = 0

function pathMove (col, row) {
  let curCol = col
  let curRow = row
  let currentEl = inputArray[curCol][curRow]
  const findIfVisit = (col = curCol, row = curRow) =>
    visited.some(([elc, elr]) => elc === col && elr === row)

  function updatePos (col, row) {
    if (!visited.find(([elc, elr]) => elc === curCol && elr === curRow))
      visited.push([curCol, curRow])
    curCol = col ?? curCol
    curRow = row ?? curRow
    return [curCol, curRow]
  }

  if (currentEl === '|') {
    if (findIfVisit(curCol + 1, curRow)) return updatePos(curCol - 1)
    return updatePos(curCol + 1)
  }
  if (currentEl === 'L') {
    if (findIfVisit(curCol - 1, curRow)) return updatePos(curCol, curRow + 1)
    return updatePos(curCol - 1)
  }
  if (currentEl === 'J') {
    if (findIfVisit(curCol, curRow - 1)) return updatePos(curCol - 1)
    return updatePos(curCol, curRow - 1)
  }
  if (currentEl === 'F') {
    if (findIfVisit(curCol, curRow + 1)) return updatePos(curCol + 1)
    return updatePos(curCol, curRow + 1)
  }
  if (currentEl === '-') {
    if (findIfVisit(curCol, curRow - 1)) return updatePos(curCol, curRow + 1)
    return updatePos(curCol, curRow - 1)
  }
  if (currentEl === '7') {
    if (findIfVisit(curCol + 1, curRow)) return updatePos(curCol, curRow - 1)
    return updatePos(curCol + 1)
  }
  return [curCol, curRow]
}

let element = null

while (!element) {
  ;[fircol, firrow] = pathMove(fircol, firrow)
  ;[seccol, secrow] = pathMove(seccol, secrow)

  if (fircol === seccol && firrow === secrow) element = [fircol, firrow]
  step++
}

let diffs = []

visited.sort()
let loopColLength = 0
let loopRowLength = 0

for (let i = 0; i < visited.length - 1; i++) {
  const currentEl = visited[i]
  const nextEl = visited[i + 1]
  const rowDiff = nextEl[1] - currentEl[1] - 1
  loopColLength = Math.max(loopColLength, nextEl[0])
  loopRowLength = Math.max(loopRowLength, nextEl[1])
  if (rowDiff >= 1) {
    diffs.push({
      element: [currentEl[0], currentEl[1] + 1],
      diff: rowDiff,
      connected: []
    })
  }
}

// function recurse (col, row) {
//   let tile = 0

//   function walk (col, row) {
//     // console.log(col, row, 'walking')
//     if (!inputArray[col] || !inputArray[col][row]) {
//       // console.log('not existo', col, row)
//       return
//     }
//     if (inputArray[col] && inputArray[col][row]) {
//       console.log('existo', inputArray[col][row])
//       if (visited.find((elc, elr) => elc === col && elr === row)) {
//         // console.log('existo in visito')

//         return
//       }
//     }

//     walk(col - 1, row)
//     walk(col + 1, row)
//     walk(col, row + 1)
//     walk(col, row - 1)
//   }
//   walk(col, row)
//   console.log({ tile })
// }

// recurse(3, 2)

// for (let { element, diff } of [{ element: [3, 2], diff: 5 }]) {
//   for (let i = 1; i <= diff; i++) {
//     curr = inputArray[element[0]][element[1] + i]
//   }
// }
let count = 0

function recorsivePrinter (connected) {
  function recursive () {
    while (connected.length) {
      const item = connected.pop()
      let itemFromDiff = diffs.findIndex(
        el => el.element[0] === item[0] && el.element[1] === item[1]
      )
      if (itemFromDiff >= 0) {
        const [col, row] = diffs[itemFromDiff].element
        inputArray[col][row] = '0'
        diffs.splice(itemFromDiff, 1)
      }

      recorsivePrinter(diffs[itemFromDiff].connected)
    }
  }

  recursive()
}

function findAdjacentElementsOfdiffs (col, row, connected) {
  let isFalse = false

  objectLoop: for (let key of Object.keys(directions)) {
    const { dir } = directions[key]
    const [dirCol, dirRow] = dir
    const [newCol, newRow] = [col + dirCol, row + dirRow]

    if (!inputArray[newCol] || !inputArray[newCol][newRow]) {
      isFalse = true
      continue objectLoop
    }
    if (visited.some(([elc, elr]) => newCol === elc && newRow === elr)) {
      continue objectLoop
    }

    connected.push([newCol, newRow])
  }

  if (isFalse) {
    recorsivePrinter(connected)
  }
}

for (let { element, diff } of diffs) {
  const [col, row] = element
  for (let i = 1; i < diff; i++) {
    diffs.push({
      element: [col, row + i],
      diff: 0,
      connected: []
    })
  }
}

diffs.sort((a, b) => a.element[0] - b.element[0])

for (let { element, connected } of diffs) {
  const [col, row] = element
  findAdjacentElementsOfdiffs(col, row, connected)
}
console.log(diffs)
