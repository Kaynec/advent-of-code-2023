const fs = require('fs')

const exampleString = fs.readFileSync('input.txt', 'utf-8')

const isNumber = num => !isNaN(parseInt(num))

function gearRatios (exampleString) {
  /**
   * Initializes the answer counter and splits the input string into an array of lines.
   *
   * answerSoFar is initialized to 0 to store the running total.
   *
   * textSplittedByTheLine splits the input string on newlines, filters out empty lines,
   * and stores the result to use later.
   */
  let answerSoFar = 0

  const textSplittedByTheLine = exampleString
    .split('\n')
    .filter(el => el !== '')

  /**
   * Loops through each row and column of the textSplittedByTheLine 2D array.
   * Checks for '*' elements, finds adjacent numeric elements in 8 directions,
   * calculates their product if exactly 2 adjacent numbers are found,
   * and adds the product to the answerSoFar total.
   */
  for (let col = 0; col < textSplittedByTheLine.length; col++) {
    const currentRow = textSplittedByTheLine[col]

    for (let row = 0; row < currentRow.length; row++) {
      let currentElement = textSplittedByTheLine[col][row]

      if (currentElement !== '*') continue

      let answerArray = []

      const possibleRatios = [
        [-1, -1],
        [-1, 0],
        [-1, +1],
        [0, -1],
        [0, +1],
        [+1, -1],
        [+1, 0],
        [+1, +1]
      ]

      ratioLoop: for (let [first, second] of possibleRatios) {
        if (!isNumber(textSplittedByTheLine[col + first][row + second]))
          continue ratioLoop
        answerArray.push(
          findTheRestOfTheElementsDigit(
            textSplittedByTheLine,
            col + first,
            row + second
          )
        )
      }

      answerArray = [...new Set(answerArray)]
      if (answerArray.length === 2)
        answerSoFar += answerArray[0] * answerArray[1]
    }

    // Inner Loop For The Numbers
  }

  /**
   * Finds the full numeric value at the given matrix position by
   * traversing left and right until non-numeric values are reached.
   *
   * @param {Array<Array<string>>} matrix - The 2D array representing the puzzle input
   * @param {number} col - The column index of the current position
   * @param {number} row - The row index of the current position
   * @returns {number} The parsed integer value of the full number at the given position
   */
  function findTheRestOfTheElementsDigit (matrix, col, row) {
    let left = row
    let leftVal = ''
    while (left >= 0 && isNumber(matrix[col][--left]))
      leftVal = matrix[col][left] + leftVal

    let rightVal = ''
    let right = row

    while (isNumber(matrix[col][++right])) rightVal += matrix[col][right]
    return parseInt(leftVal + matrix[col][row] + rightVal)
  }
  return answerSoFar
}
console.log(gearRatios(exampleString))
