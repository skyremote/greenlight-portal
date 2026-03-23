interface ICSEventParams {
  name: string
  date: string
  time: string
  duration: number
  location?: string
  agenda?: string
  email?: string
}

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

function formatICSDate(dateStr: string, timeStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const [hours, minutes] = timeStr.split(':').map(Number)
  return `${year}${pad(month)}${pad(day)}T${pad(hours)}${pad(minutes)}00`
}

function addMinutes(dateStr: string, timeStr: string, minutes: number): string {
  const dt = new Date(`${dateStr}T${timeStr}:00`)
  dt.setMinutes(dt.getMinutes() + minutes)
  const y = dt.getFullYear()
  const m = pad(dt.getMonth() + 1)
  const d = pad(dt.getDate())
  const h = pad(dt.getHours())
  const min = pad(dt.getMinutes())
  return `${y}${m}${d}T${h}${min}00`
}

function generateUID(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}@greenlight-portal`
}

export function generateICSFile(params: ICSEventParams): void {
  const { name, date, time, duration, location, agenda, email } = params

  const dtStart = formatICSDate(date, time)
  const dtEnd = addMinutes(date, time, duration)
  const now = new Date()
  const dtStamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}T${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}Z`

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Greenlight Portal//Coaching Session//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${generateUID()}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${name}`,
  ]

  if (location) {
    lines.push(`LOCATION:${location}`)
  }

  if (agenda) {
    const escapedAgenda = agenda.replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;')
    lines.push(`DESCRIPTION:${escapedAgenda}`)
  }

  if (email) {
    lines.push(`ATTENDEE;CN=${name}:mailto:${email}`)
  }

  lines.push(
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Coaching session reminder',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  )

  const content = lines.join('\r\n')
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `coaching-session-${date}.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
