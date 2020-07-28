const shuffle = (array) => {
  const shuffled = [...array]
  let currentIndex = shuffled.length

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    const temporaryValue = shuffled[currentIndex]
    shuffled[currentIndex] = shuffled[randomIndex]
    shuffled[randomIndex] = temporaryValue
  }
  return shuffled
}

const spaceArray = (array, space = 1, key = '_id') => {
  const spaced = [...array]
  for (let i = 0; i + 1 < array.length; i++) {
    if (array[i][key] === array[i + 1][key]) {
      if (i + 1 + space < array.length) {
        const temporaryElement = spaced[i + 1 + space]
        spaced[i + 1 + space] = spaced[i + 1]
        spaced[i + 1] = temporaryElement
      } else if (i - 1 - space >= 0) {
        const temporaryElement = spaced[i - 1 - space]
        spaced[i - 1 - space] = spaced[i + 1]
        spaced[i + 1] = temporaryElement
      }
    }
  }
  return spaced
}

module.exports = {
  shuffle,
  spaceArray,
}
