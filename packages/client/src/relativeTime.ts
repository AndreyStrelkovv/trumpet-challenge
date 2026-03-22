const MINUTE = 60
const HOUR = 3600
const DAY = 86400
const WEEK = 604800
const MONTH = 2592000
const YEAR = 31536000

export function relativeTime(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)

  if (seconds < 0) return "just now"
  if (seconds < MINUTE) return "just now"
  if (seconds < HOUR) {
    const minutes = Math.floor(seconds / MINUTE)
    return `${minutes}m ago`
  }
  if (seconds < DAY) {
    const hours = Math.floor(seconds / HOUR)
    return `${hours}h ago`
  }
  if (seconds < WEEK) {
    const days = Math.floor(seconds / DAY)
    return `${days}d ago`
  }
  if (seconds < MONTH) {
    const weeks = Math.floor(seconds / WEEK)
    return `${weeks}w ago`
  }
  if (seconds < YEAR) {
    const months = Math.floor(seconds / MONTH)
    return `${months}mo ago`
  }
  const years = Math.floor(seconds / YEAR)
  return `${years}y ago`
}
