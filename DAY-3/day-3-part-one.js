const fs = require('fs')

const exampleString = fs.readFileSync('input.txt', 'utf-8')

const isNumber = num => !isNaN(parseInt(num))

const textSplittedByTheLine = exampleString.split('\n')

let sum = 0

function checkForCorrElement (matrix, row, col) {
  return [
    matrix[col - 1][row - 1],
    matrix[col - 1][row],
    matrix[col - 1][row + 1],

    matrix[col][row - 1],
    matrix[col][row + 1],

    matrix[col + 1][row - 1],
    matrix[col + 1][row],
    matrix[col + 1][row + 1]
  ]
    .filter(el => el)
    .some(el => isNaN(parseInt(el)) && el !== '.')
}

for (let col = 0; col < textSplittedByTheLine.length; col++) {
  const currRow = textSplittedByTheLine[col]

  for (let row = 0; row < currRow.length; row++) {
    let currEl = textSplittedByTheLine[col][row]
    if (isNaN(parseInt(currEl))) continue
    let isCorrectEl = false

    let i = row

    let currentElement = textSplittedByTheLine[col][i]

    let substring = ''
    isNumberLoop: while (isNumber(currentElement)) {
      const bool = checkForCorrElement(textSplittedByTheLine, i, col)
      if (bool) isCorrectEl = bool
      currentElement = textSplittedByTheLine[col][i]
      let nextEl = textSplittedByTheLine[col][i + 1]
      substring += currentElement
      if (isNaN(nextEl)) {
        row = i + 1
        currentElement = textSplittedByTheLine[col][i]
        break isNumberLoop
      }
      i += 1
    }
    if (isCorrectEl) sum += parseInt(substring)
  }
}
console.log(sum)
