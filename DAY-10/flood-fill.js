function floodFill (image, sr, sc, targetColor) {
  const len = image.length
  function walk (image, sr, sc, passedColor) {
    if (
      sr < 0 ||
      sc < 0 ||
      sr > len ||
      sc > len ||
      image[sr] === undefined ||
      image[sr][sc] === undefined ||
      image[sr][sc] === targetColor ||
      image[sr][sc] !== passedColor
    ) {
      return
    }
    const oldImageValue = image[sr][sc]
    image[sr][sc] = targetColor
    walk(image, sr + 1, sc, oldImageValue)
    walk(image, sr - 1, sc, oldImageValue)
    walk(image, sr, sc + 1, oldImageValue)
    walk(image, sr, sc - 1, oldImageValue)
  }
  walk(image, sr, sc, image[sr][sc], targetColor)
  return image
}

function islandPerimeter (grid) {
  const FULL_TILE_COUNT = 4,
    resArray = []
  function checkAdjacentElement (row, col) {
    let count = 0
    if (grid[row - 1] && grid[row - 1][col]) count++
    if (grid[row + 1] && grid[row + 1][col]) count++
    if (grid[row] && grid[row][col + 1]) count++
    if (grid[row] && grid[row][col - 1]) count++
    return count
  }

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === 0) continue
      const adjacentElements = checkAdjacentElement(i, j)
      resArray.push(FULL_TILE_COUNT - adjacentElements)
    }
  }
  return resArray.reduce((total, curr) => (total += curr))
}

function maxAreaOfIsland (grid) {
  let maxCount = 0
  function walk (grid, row, col) {
    let count = 0
    function recorse (grid, row, col) {
      if (
        row < 0 ||
        col < 0 ||
        row > grid.length ||
        col > grid[0].length ||
        !grid[row] ||
        !grid[row][col]
      )
        return
        grid[row][col] = 0
      count += 1
      recorse(grid, row - 1, col)
      recorse(grid, row + 1, col)
      recorse(grid, row, col - 1)
      recorse(grid, row, col + 1)
    }
    recorse(grid, row, col)
    return count
  }
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === 0) continue
      let count = walk(grid, i, j)
      maxCount = Math.max(maxCount, count)
    }
  }
  return maxCount
}
function numIslands (grid) {
  let count = 0
  function walk (grid, row, col) {
    let count = 0
    function recorse (grid, row, col) {
      if (
        row < 0 ||
        col < 0 ||
        row > grid.length ||
        col > grid[0].length ||
        !grid[row] ||
        grid[row][col] !== '1'
      )
        return

      grid[row][col] = '0'
      count += 1
      recorse(grid, row - 1, col)
      recorse(grid, row + 1, col)
      recorse(grid, row, col - 1)
      recorse(grid, row, col + 1)
    }
    recorse(grid, row, col)
    return count
  }
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === '1') continue
      const walking = walk(grid, i, j)
      if (walking >= 1) count++
    }
  }
  return count
}