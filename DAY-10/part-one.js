const { readFileSync } = require('fs')
let inputArray = readFileSync(process.argv[2] || 'sample', 'utf-8').split(
  '\r\n'
)
function ifTheyFit (currentElement, nextElement) {
  const arrays = [
    'F,7',
    'L,7',
    'L,-',
    '-,J',
    '-,7',
    'F,-',
    'F,J',
    'L,J',
    '-,-',
    'S,-',
    'S,7',
    'S,J',
    'F,S',
    '-,S'
  ]
  return arrays.includes(`${currentElement},${nextElement}`)
}
function theyFitVertically (currentElement, nextElement) {
  const arrays = [
    'F,L',
    'F,|',
    'F,J',
    '7,J',
    '7,|',
    '7,L',
    '|,J',
    '|,L',
    '|,|',
    'S,|',
    'S,J',
    '|,S',
    '7,S'
  ]

  const element = `${currentElement},${nextElement}`
  return arrays.includes(element)
}

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

function pathMove (col, row, visited) {
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

function handleVisits () {
  let startingPosCol = inputArray.findIndex(el => el.indexOf('S') >= 0)
  let startingPosRow = inputArray[startingPosCol].indexOf('S')

  const startingPaths = findAdjacentElements(startingPosCol, startingPosRow)
  let [firstPath, secondPath] = startingPaths

  let [fircol, firrow] = firstPath
  let [seccol, secrow] = secondPath

  let visitedArr = [[startingPosCol, startingPosRow]]
  let element = null
  while (!element) {
    ;[fircol, firrow] = pathMove(fircol, firrow, visitedArr)
    ;[seccol, secrow] = pathMove(seccol, secrow, visitedArr)

    if (fircol === seccol && firrow === secrow) {
      element = [fircol, firrow]
      visitedArr.push([fircol, firrow])
    }
  }

  function sortedArray (a, b) {
    if (b[0] === a[0]) return b[1] - a[1]
    return b[0] - a[0]
  }

  visitedArr.sort(sortedArray).reverse()
  return visitedArr
}
let visited = handleVisits()

for (let i = 0; i < visited.length - 1; i++) {
  const currentEl = visited[i]
  const nextEl = visited[i + 1]
  const rowDiff = nextEl[1] - currentEl[1] - 1

  let tmp = inputArray[currentEl[0]].split('')
  if (rowDiff >= 1)
    for (let j = 1; j <= rowDiff; j++) tmp[j + currentEl[1]] = 'I'

  inputArray[currentEl[0]] = tmp.join('')
}

for (let i = 0; i < inputArray.length; i++) {
  inputArray[i] = inputArray[i].split('')

  for (let j = 0; j < inputArray[i].length - 1; j++) {
    let currentElement = inputArray[i][j]
    let nextElement = inputArray[i][j + 1]

    let b = ifTheyFit(currentElement, nextElement) ? '-' : '#'
    inputArray[i].splice(j + 1, 0, b)

    j++
  }

  inputArray[i] = inputArray[i].join('')
}

for (let i = 0; i < inputArray.length - 1; i++) {
  let theyDontConnect = false
  let newInputArray = []

  for (let j = 0; j < inputArray[i].length; j++) {
    let currentElement = inputArray[i][j]
    let nextElement = inputArray[i + 1][j]
    if (!theyFitVertically(currentElement, nextElement)) {
      theyDontConnect = true
      newInputArray.push('#')
    } else newInputArray.push('|')
  }
  if (theyDontConnect) {
    inputArray = [
      ...inputArray.slice(0, i + 1),
      newInputArray.join(''),
      ...inputArray.slice(i + 1)
    ]
    i++
  }
}
visited = handleVisits()
let diffs = []
let sum2 = 0

for (let i = 0; i < inputArray.length; i++) {
  for (let j = 0; j < inputArray[i].length; j++)
    if (inputArray[i][j] === 'I') diffs.push([i, j])
}

let visitedMap = {}

function walkStack (ogCol, ogRow) {
  function isValid (col, row) {
    if (inputArray[col]?.[row] === 'x') {
      for (let [ecol, erow] of visitedElements) {
        if (inputArray[ecol] && inputArray[ecol][erow]) {
          let tmp = inputArray[ecol].split('')
          if (tmp[erow] === 'I') tmp[erow] = 'X'
          inputArray[ecol] = tmp.join('')
        }
      }
      return
    }
    if (visitedMap[`${col},${row}`]) return false
    if (visited.some(([elc, elr]) => elc === col && row === elr)) return false
    if (que.some(([elc, elr]) => elc === col && row === elr)) return false
    if (
      row <= 0 ||
      row >= inputArray[0].length ||
      col < 0 ||
      col >= inputArray.length ||
      inputArray[col][row] === 'X'
    ) {
      allAreInvalid = true

      return
    }
    que.push([col, row])
  }

  let que = [[ogCol, ogRow]]

  let visitedElements = [[ogCol, ogRow]]

  let allAreInvalid = false

  while (que.length) {
    const [col, row] = que.shift()
    // FUCKKKKKKKKKKKKKKKKKKKKKKKK
    // console.log('why stuck', col, row)

    visitedMap[`${col},${row}`] = true
    visitedElements.push([col, row])

    isValid(col - 1, row)
    isValid(col, row + 1)
    isValid(col + 1, row)
    isValid(col, row - 1)
  }
  if (allAreInvalid) {
    for (let [ecol, erow] of visitedElements) {
      if (inputArray[ecol] && inputArray[ecol][erow]) {
        let tmp = inputArray[ecol].split('')
        if (tmp[erow]) tmp[erow] = 'X'
        inputArray[ecol] = tmp.join('')
      }
    }
  }
}

console.log('BEGIN', diffs.length)

for (let [col, row] of diffs) walkStack(col, row)

let sum = 0

for (let line of inputArray) {
  for (let char of line) if (char === 'I') sum++
}
console.log(sum)
