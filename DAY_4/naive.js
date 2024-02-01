const fs = require('fs')

const exampleString = fs.readFileSync('input.txt', 'utf-8')

const exampleString2 = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`

let textSplittedByTheLine = exampleString.split('\n')

let hashMap = {}
function returnSum (line) {
  let score = 0
  let newLine = line.split(':')[1]
  let firstHalf = newLine.split('|')[0]
  let secondHalf = newLine.split('|')[1]

  firstHalf = firstHalf
    .split(' ')
    .filter(el => parseInt(el))
    .map(el => parseInt(el))

  secondHalf = secondHalf
    .split(' ')
    .filter(el => parseInt(el))
    .map(el => parseInt(el))

  for (let num of secondHalf) {
    if (firstHalf.includes(num)) score += 1
  }
  return score
}

function generateResults () {
  for (let l = 0; l < textSplittedByTheLine.length; l++) {
    let line = textSplittedByTheLine[l]
    let cardNumber = parseInt(line.split(':')[0].split('Card')[1])
    let score = returnSum(line)

    if (score) hashMap[cardNumber] = score

    for (let j = cardNumber + 1; j <= cardNumber + score; j++) {
      const startWith = `Card ${j}`
      const index = textSplittedByTheLine.findIndex(el =>
        el.startsWith(startWith)
      )
      const el = textSplittedByTheLine.find(el => el.startsWith(startWith))
      if (el) textSplittedByTheLine.splice(index, 0, el)
    }
    console.log(textSplittedByTheLine)
  }
}

generateResults()

console.log(textSplittedByTheLine.length)
