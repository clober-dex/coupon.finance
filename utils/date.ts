export const formatDate = (date: Date): string =>
  Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
    .format(date.setDate(date.getDate() - 1))
    .replace(',', '')

// TODO: adjust deadline for permit20
export const tomorrowTimestampInSeconds = (): bigint => {
  return BigInt(Math.floor(new Date().getTime() / 1000 + 60 * 60 * 24))
}
