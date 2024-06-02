export function formatDuration(seconds: number) {
  if (!seconds) return
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor(seconds % 3600 / 60)
  return `${hours}h ${minutes}m`
}
