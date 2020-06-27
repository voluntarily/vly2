import moment from 'moment'

/**
 * Appropriately maps a duration string to be displayed.
 * The duration string may be in the ISO 8601 duration format, or may be free text.
 * Parses the string if possible, otherwise returns the free text.
 *
 * @param {string} duration to display
 */
export const displayDuration = duration => {
  const isoDuration = moment.duration(duration)
  
  // Needed for durations >= 24 hours e.g. 'P1DT10H40M'
  const totalHours = Math.floor(isoDuration.asHours())

  // free text duration
  if (!totalHours && !isoDuration.minutes()) {
    return duration
  }

  // valid ISO 8601 duration
  let durationString = ''
  if (totalHours) {
    durationString = durationString.concat(`${totalHours} hour${totalHours > 1 ? 's' : ''}`)
  }
  if (isoDuration.minutes()) {
    if (durationString) {
      durationString = durationString.concat(' ')
    }
    durationString = durationString.concat(`${isoDuration.minutes()} minute${isoDuration.minutes() > 1 ? 's' : ''}`)
  }

  return durationString
}
