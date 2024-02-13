const { readFileSync } = require('fs')

let inputArray = readFileSync('sample', 'utf-8').split('\r\n')

let startingPosCol = inputArray.findIndex(el => el.indexOf('S') >= 0)
let startingPosRow = inputArray[startingPosCol].indexOf('S')

const directions = {
  TOP: {
    chars: ['7', 'F', 'F', '|'],
    dir: [-1, 0]
  },
  BOTTOM: {
    chars: ['J', 'L', '|'],
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

  if (fircol === seccol && firrow === secrow) {
    element = [fircol, firrow]
    visited.push([fircol, firrow])
  }
  step++
}

let diffs = []

function sortedArray (a, b) {
  if (b[0] === a[0]) {
    return b[1] - a[1]
  }
  return b[0] - a[0]
}

visited.sort(sortedArray).reverse()

for (let i = 0; i < visited.length - 1; i++) {
  const currentEl = visited[i]
  const nextEl = visited[i + 1]
  const rowDiff = nextEl[1] - currentEl[1] - 1

  if (rowDiff >= 1) {
    diffs.push({
      element: [currentEl[0], currentEl[1] + 1],
      diff: rowDiff,
      connected: []
    })
  }
}

function recorsivePrinter (connected) {
  function recursive () {
    while (connected?.length) {
      const item = connected.pop()
      let itemFromDiff = diffs.find(
        el => el.element[0] === item[0] && el.element[1] === item[1]
      )
      // console.log(itemFromDiff)
      if (itemFromDiff) {
        const [col, row] = itemFromDiff.element
        //
        let spl = inputArray[col].split('')
        spl[row] = '*'
        inputArray[col] = spl.join('')
        //
        diffs = diffs.filter(
          el => el.element[0] !== col || el.element[1] !== row
        )
        if (itemFromDiff) recorsivePrinter(itemFromDiff.connected)
      }
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

    if (
      !inputArray[newCol] ||
      !inputArray[newCol][newRow] ||
      inputArray[newCol][newRow] === '*'
    ) {
      console.log('BOY', col, row, inputArray[col][row])
      isFalse = true
      continue objectLoop
    }
    if (visited.some(([elc, elr]) => newCol === elc && newRow === elr)) {
      continue objectLoop
    }

    connected.push([newCol, newRow])
  }

  if (isFalse) {
    let spl = inputArray[col].split('')
    spl[row] = '*'
    inputArray[col] = spl.join('')
    recorsivePrinter(connected)
  }
}

for (let { element, diff } of diffs) {
  const [col, row] = element
  for (let i = 1; i < diff; i++) {
    diffs.push({
      element: [col, row + i],
      connected: []
    })
  }
}

console.log(diffs)

diffs.sort((a, b) => a.element[0] - b.element[0])

for (let col = 0; col < inputArray.length; col++) {
  let len = inputArray[col].length
  for (let row = 0; row < len; row++) {
    let isNotInsideDiffs = !diffs.some(({ element }) => {
      return element[0] === col && element[1] === row
    })
    let isNotInsideVisited = !visited.some(
      ([ecol, erow]) => ecol === col && erow === row
    )

    if (isNotInsideDiffs && isNotInsideVisited) {
      let spl = inputArray[col].split('')
      spl[row] = '*'
      inputArray[col] = spl.join('')
    }
  }
}

diffs.forEach(({ element }) => {
  let spl = inputArray[element[0]].split('')
  spl[element[1]] = 'I'
  inputArray[element[0]] = spl.join('')
})

for (let { element, connected } of diffs) {
  const [col, row] = element
  findAdjacentElementsOfdiffs(col, row, connected)
}

console.log(diffs.length)

console.log(
  inputArray,
  inputArray
    .join('')
    .split('')
    .filter(el => el === 'I').length
)
