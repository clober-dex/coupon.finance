export const formatDate = (date: Date): string =>
  Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
    .format(date)
    .replace(',', '')
