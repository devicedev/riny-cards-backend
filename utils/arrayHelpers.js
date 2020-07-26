const shuffle = (array) => {
  const copy = [...array]
  let currentIndex = copy.length

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    const temporaryValue = copy[currentIndex]
    copy[currentIndex] = copy[randomIndex]
    copy[randomIndex] = temporaryValue
  }
  return copy
}

const spaceArray = (array, space = 2, key = '_id') => {
  const copy = [...array]
  for (let i = 0; i + 1 < array.length; i++) {
    if (array[i][key] === array[i + 1][key]) {
      if (i + 1 + space < array.length) {
        const temporaryElement = copy[i + 1 + space]
        copy[i + 1 + space] = copy[i + 1]
        copy[i + 1] = temporaryElement
      } else {
        const temporaryElement = copy[i - 1 - space]
        copy[i - 1 - space] = copy[i + 1]
        copy[i + 1] = temporaryElement
      }
    }
  }
  return copy
}

module.exports = {
  shuffle,
  spaceArray,
}
