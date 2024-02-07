const fs = require('fs')

let inputString = fs
  .readFileSync('input', 'utf-8')
  .split('\r\n')
  .map(el => el.split(' ').map(Number))

let values = 0

for (let i = 0; i < inputString.length; i++) {
  {
    let elementsAreNotZero = true

    let nextArr = [inputString[i]]

    while (elementsAreNotZero) {
      let newArray = []

      let areElementsZero = true

      for (let j = 0; j < nextArr[nextArr.length - 1].length - 1; j++) {
        let currElement = nextArr[nextArr.length - 1][j]
        let nextElem = nextArr[nextArr.length - 1][j + 1]

        let diff = nextElem - currElement

        newArray.push(diff)

        if (diff !== 0) areElementsZero = false
      }
      nextArr.push(newArray)

      if (areElementsZero) {
        elementsAreNotZero = false
      }
    }

    let value = 0

    let len = nextArr.length - 2

    for (let j = len; j >= 0; j--) {
      const currentSecondToLastElem = nextArr[j][nextArr[j].length - 1]
      const lastElemFromBottomArr = nextArr[j + 1]?.length
        ? nextArr[j + 1][nextArr[j + 1].length - 1]
        : 0

      value = currentSecondToLastElem + lastElemFromBottomArr
      nextArr[j].push(value)
    }
    values += value
  }
}
console.log(values)
// for (let i = 0; i < inputString.length; i++) {
//   const el = inputString[i]
//   const secondToLastValue = el[el.length - 2]
//   const lastValue = el[el.length - 1]

//   const diff = lastValue - secondToLastValue

//   values.push(lastValue + diff)
//   console.log(lastValue + diff)
// }

// console.log(values.reduce((total, curr) => (total += curr)))
