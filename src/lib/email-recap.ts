interface RecapParams {
  recipientEmail: string
  recipientName: string
  sessionDate: string
  actionItems: string[]
  notes?: string
}

export function openEmailRecap(params: RecapParams): void {
  const { recipientEmail, recipientName, sessionDate, actionItems, notes } = params

  const subject = encodeURIComponent(`Coaching Session Recap - ${sessionDate}`)

  const bodyLines: string[] = [
    `Hi ${recipientName},`,
    '',
    `Here is a recap of our coaching session on ${sessionDate}.`,
    '',
    'Action Items:',
    ...actionItems.map((item, i) => `  ${i + 1}. ${item}`),
  ]

  if (notes) {
    bodyLines.push('', 'Notes:', notes)
  }

  bodyLines.push(
    '',
    'Please let me know if you have any questions or need to adjust any of the above.',
    '',
    'Best regards',
  )

  const body = encodeURIComponent(bodyLines.join('\n'))

  window.open(`mailto:${recipientEmail}?subject=${subject}&body=${body}`, '_blank')
}
