export const calcTotalTime = (sessionLogs: string[]) => {
  if (!sessionLogs?.length) return 0

  return sessionLogs.reduce((a, b) => {
    const duration = +b.split('|')[0] || 0
    return (a += duration)
  }, 0)
}
