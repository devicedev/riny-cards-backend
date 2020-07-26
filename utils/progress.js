const getLessonPartsProgress = (questions, cards) => {
  const { length: cardsLength } = cards
  const parts = []

  for (let i = 0; i < cardsLength; i += 5) {
    const part = cards.slice(i, i + 5)
    const partProgress = { value: 0, locked: false }

    part.forEach((partCard) => {
      const cardQuestions = questions.filter(
        (question) => question.card.toString() === partCard._id.toString()
      )
      if (cardQuestions.length === 0) {
        partProgress.locked = true
        return
      }
      const correctQuestions = cardQuestions.filter(
        (question) => question.correct
      ).length
      const incorrectQuestions = cardQuestions.filter(
        (question) => !question.correct
      ).length

      let module = correctQuestions - incorrectQuestions
      module = module < 0 ? 0 : module

      const cardProgress =
        correctQuestions > incorrectQuestions * 2
          ? 100
          : (module / correctQuestions) * 100
      if (cardProgress !== 100) {
        console.log('correct', correctQuestions)
        console.log('incorrect', incorrectQuestions)
        console.log(correctQuestions > incorrectQuestions * 2)
        console.log(cardProgress)
        console.log(partCard.front)
      }

      partProgress.value += cardProgress
    })
    const { locked, value } = partProgress
    parts.push({
      progress: value / part.length,
      locked,
    })
  }
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].locked) {
      parts[i].locked = false
      for (let j = i + 1; j < parts.length; j++) {
        parts[j].locked = true
      }
      break
    }
  }
  return parts
}

const getLessonProgress = (questions, cards) => {
  const parts = getLessonPartsProgress(questions, cards)
  return parts.reduce((acc, part) => acc + part.progress, 0) / parts.length
}

module.exports = {
  getLessonProgress,
  getLessonPartsProgress,
}
