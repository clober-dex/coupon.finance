export type Point = {
  totalPoint: number
  tomorrowTotalPoint: number
  dragonPoint: number
  userPoint: number
  bondPositionPoint: number
  loanPositionPoint: number
}

export type DragonPoint = {
  point: number
  claimed: boolean
  pudgyPoint: number
  defiPoint: number
  substantialBenefitPoint: number
}

type Rank = {
  id: `0x${string}`
  point: number
  ranking: number
}

export type Leaderboard = {
  pointRankings: Rank[]
  myRanking: Rank | null
}

export type Tier = {
  start: number
  end: number
  level: number
  label: string
}
