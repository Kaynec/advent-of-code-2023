const fs = require('fs')
const inputString = fs.readFileSync('input.txt', 'utf-8')
let hashMap = {}
let txtByLine = inputString.split('\n')
/**
 * Calculates the score for the given line from the input by:
 * - Splitting the line on ':' to separate the card number from the selections
 * - Splitting the selections on '|' to separate the winning numbers from my numbers
 * - Mapping the winning numbers and my numbers to arrays of numbers
 * - Iterating through my numbers and incrementing the score for each number that is in the winning numbers
 * - Returning the final score
 */
function returnSum (line) {
  let score = 0
  let newLine = line.split(':')[1]
  const [first, second] = newLine.split('|')
  const winningNums = first.trim().split(/\s+/).map(Number)
  const myNums = second.trim().split(/\s+/).map(Number)
  for (let num of myNums) if (winningNums.includes(num)) score += 1
  return score
}
/**
 * Sets the count and score properties on each card number object
 * in the hashMap by iterating through each line of input.
 *
 * For each line:
 * - Get the card number
 * - Calculate the score for that line
 * - Initialize the count to 1
 * - Add the card number object to the hashMap with the score and count
 */
function setTheCountAndScoreOfEachLine () {
  for (let l = 0; l < txtByLine.length; l++) {
    let line = txtByLine[l]
    let cardNumber = parseInt(line.split(':')[0].split('Card')[1])
    let score = returnSum(line)

    let count = 1

    hashMap[cardNumber] = {
      count,
      score
    }
  }
}
function generateResults () {
  setTheCountAndScoreOfEachLine()
  for (let l = 0; l < txtByLine.length; l++) {
    /**
     * Gets the score and count for the current line's card number
     * from the hashMap generated earlier.
     */
    let line = txtByLine[l]
    let cardNumber = parseInt(line.split(':')[0].split('Card')[1])
    const score = hashMap[cardNumber]?.score
    const count = hashMap[cardNumber]?.count
    /**
     * If the score is 0, add the card number object to the hashMap
     * with the current count (but no score). Then continue to the
     * next iteration of the loop.
     */
    if (!score) {
      hashMap[cardNumber] = {
        ...hashMap[cardNumber],
        count
      }
      continue
    }
    /**
     * For each card number that wins:
     * - Calculate the number of copies won by multiplying count * score
     * - Increment count for every subsequent card number by copies won / score
     *   - This distributes the copies won evenly across subsequent cards
     *   - Ensures each card gets the appropriate number of copies based on its position
     */
    let copiesWon = count * score
    for (let i = 1; i <= score; i++) {
      let nextCardNumber = cardNumber + i

      const count = hashMap[nextCardNumber]?.count + copiesWon / score

      hashMap[nextCardNumber] = {
        ...hashMap[nextCardNumber],
        count
      }
    }
  }
}

generateResults()
let sum = Object.values(hashMap).reduce(
  (total, curr) => (total += curr.count),
  0
)
// Sum Is What We need
console.log(sum)
