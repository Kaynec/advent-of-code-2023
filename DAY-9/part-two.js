const fs = require('fs')

let inputString = fs
  .readFileSync('input', 'utf-8')
  .split('\r\n')
  .map(el => el.split(' ').map(Number))

function returnFinalPerdict (nextArr) {
  let firstValPredict = 0

  let len = nextArr.length - 2

  for (let j = len; j >= 0; j--) {
    const currentSecondToLast = nextArr[j][0]
    const lastFromBottomArr = nextArr[j + 1][0]

    firstValPredict = currentSecondToLast - lastFromBottomArr
    nextArr[j].unshift(firstValPredict)
  }
  return firstValPredict
}

function setupLineMatrix (line) {
  let nextArr = [line]
  let allElementsAreNotZero = true

  while (allElementsAreNotZero) {
    let latestBranch = []

    let areAllZero = true

    let lastElement = nextArr[nextArr.length - 1]

    for (let j = 0; j < lastElement.length - 1; j++) {
      let currElement = lastElement[j]
      let nextElem = lastElement[j + 1]

      let diff = nextElem - currElement

      latestBranch.push(diff)

      if (diff !== 0) areAllZero = false
    }
    nextArr.push(latestBranch)
    if (areAllZero) allElementsAreNotZero = false
  }
  return nextArr
}

function returnPerdictOfLine (line) {
  const nextArr = setupLineMatrix(line)

  let firstValPredict = returnFinalPerdict(nextArr)

  return firstValPredict
}

const reducedValsPredicts = inputString
  .map(returnPerdictOfLine)
  .reduce((total, curr) => (total += curr))

console.log(reducedValsPredicts)
