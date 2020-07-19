const arrayHelpers = (array) => {
  let currentIndex = array.length

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    const temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }
  return array
}
const spaceArray = (array, space = 2, key = '_id') => {
  for (let i = 0; i + 1 < array.length; i++) {
    if (array[i][key] === array[i + 1][key]) {
      if (i + 1 + space < array.length) {
        const temporaryElement = array[i + 1 + space]
        array[i + 1 + space] = array[i + 1]
        array[i + 1] = temporaryElement
      } else {
        const temporaryElement = array[i - 1 - space]
        array[i - 1 - space] = array[i + 1]
        array[i + 1] = temporaryElement
      }
    }
  }
  return array
}
module.exports = {
  shuffle: arrayHelpers,
  spaceArray,
}
