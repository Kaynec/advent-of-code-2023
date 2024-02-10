const { readFileSync } = require('fs')

let inputArray = readFileSync('input', 'utf-8').split('\r\n')

let startingPosCol = inputArray.findIndex(el => el.indexOf('S') >= 0)
let startingPosRow = inputArray[startingPosCol].indexOf('S')

function findAdjacentElements (col, row) {
  const paths = []

  // Top El
  let topEL = inputArray[col - 1][row]

  if (
    topEL &&
    inputArray[col - 1][row] !== '.' &&
    (topEL === '|' || topEL === '7' || topEL === 'F' || topEL === 'J')
  )
    paths.push([col - 1, row])

  // Right Side
  let rightEl = inputArray[col][row + 1]
  if (
    rightEl &&
    rightEl !== '.' &&
    (rightEl === '-' || rightEl === '7' || rightEl === 'J')
  )
    paths.push([col, row + 1])

  // left Side
  let leftEl = inputArray[col][row - 1]
  if (
    leftEl &&
    leftEl !== '.' &&
    (leftEl === '-' || leftEl === 'L' || leftEl === 'F')
  )
    paths.push([col, row - 1])

  // bottom El
  let bottomEL = inputArray[col + 1][row]

  if (
    bottomEL &&
    inputArray[col + 1][row] !== '.' &&
    (bottomEL === '|' ||
      bottomEL === 'L' ||
      bottomEL === '7' ||
      bottomEL === 'F')
  )
    paths.push([col + 1, row])

  return paths
}

const startingPaths = findAdjacentElements(startingPosCol, startingPosRow)
console.log(startingPaths)

// ..F7.
// .FJ|.
// SJ.L7
// |F--J
// LJ...

const allVisited = []
const firstVisited = []
const secondVisited = []

let [firstPath, secondPath] = startingPaths[0]
let [fircol, firrow] = firstPath
let [seccol, secrow] = secondPath

while (true) {
  ;[fircol, curcol] = pathMove(fircol, firrow)
  ;[seccol, secrow] = pathMove(seccol, secrow)

  firstVisited.push(fircol, curcol)
  secondVisited.push(seccol, secrow)
  if (
    firstVisited.some(([col, row]) =>
      secondVisited.find(([col2, row2]) => col === col2 && row === row2)
    )
  )
    break
}

function pathMove (col, row) {
  function updateCordinates (col, row) {
    if (!visited.find(([elc, elr]) => elc === currentCol && elr === currentRow))
      visited.push([currentCol, currentRow])
    currentCol = col || currentCol
    currentRow = row || currentRow
    currentEl = inputArray[currentCol][currentRow]
  }

  function findIfVisited (col, row) {
    return visited.some(([elc, elr]) => {
      return elc === col && elr === row
    })
  }

  let currentCol = col
  let currentRow = row
  let currentEl = inputArray[currentCol][currentRow]
  const visited = [[startingPosCol, startingPosRow]]

  // console.log(visited)
  if (currentEl === '|') {
    if (findIfVisited(currentCol + 1, currentRow))
      updateCordinates(currentCol - 1)
    else updateCordinates(currentCol + 1)
  }
  // if the one above is in visited then go to right and if right is visited to left
  else if (currentEl === 'L') {
    if (findIfVisited(currentCol - 1, currentRow))
      updateCordinates(currentCol, currentRow + 1)
    else updateCordinates(currentCol - 1)
  }
  // if the one Left is in visited then go to right and if right is visited to left
  else if (currentEl === 'J') {
    if (findIfVisited(currentCol, currentRow - 1))
      updateCordinates(currentCol - 1)
    else updateCordinates(currentCol, currentRow - 1)
  } else if (currentEl === 'F') {
    if (findIfVisited(currentCol, currentRow + 1))
      updateCordinates(currentCol + 1)
    else updateCordinates(currentCol, currentRow + 1)
  } else if (currentEl === '-') {
    if (findIfVisited(currentCol, currentRow - 1))
      updateCordinates(currentCol, currentRow + 1)
    else updateCordinates(currentCol, currentRow - 1)
  } else if (currentEl === '7') {
    if (findIfVisited(currentCol + 1, currentRow))
      updateCordinates(currentCol, currentRow - 1)
    else updateCordinates(currentCol + 1)
  }
  return [currentCol, currentRow]
}
