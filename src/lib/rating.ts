export type GameResult = {
  whiteRating: number
  blackRating: number
  whiteProvisional: boolean
  blackProvisional: boolean
  result: 'white' | 'black' | 'draw'
}

export function calculateRatingChange(result: GameResult) {
  const K = (rating: number, provisional: boolean) => {
    if (provisional) return 40
    if (rating < 2300) return 32
    if (rating < 2400) return 24
    return 16
  }

  const expectedScore = (ratingA: number, ratingB: number) => {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400))
  }

  const whiteExpected = expectedScore(result.whiteRating, result.blackRating)
  const blackExpected = 1 - whiteExpected

  const actualWhiteScore = result.result === 'white' ? 1 : result.result === 'draw' ? 0.5 : 0
  const actualBlackScore = 1 - actualWhiteScore

  const whiteK = K(result.whiteRating, result.whiteProvisional)
  const blackK = K(result.blackRating, result.blackProvisional)

  return {
    whiteRatingChange: Math.round(whiteK * (actualWhiteScore - whiteExpected)),
    blackRatingChange: Math.round(blackK * (actualBlackScore - blackExpected))
  }
} 