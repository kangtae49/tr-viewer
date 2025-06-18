
export const getDateFormatter = (): Intl.DateTimeFormat => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

export const g_date_formatter = getDateFormatter()

export const toDate = (t: number | undefined): string => {
  if (t == undefined) {
    return ''
  }
  const date = new Date(Number(t) * 1000)
  const formatted = g_date_formatter.format(date)
  const arr = formatted.replace(/\s+/g, '').split('.')
  return arr.slice(0, 3).join('-') + ' ' + arr.slice(-1)[0]
}

export const formatFileSize = (bytes: number | undefined): string => {
  if (bytes == undefined) {
    return ''
  }
  if (bytes === 0) return '0KB'
  const kb = Math.ceil(bytes / 1024)
  return kb.toLocaleString('en-US') + 'KB'
}

