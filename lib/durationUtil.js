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

  // free text duration
  if (!isoDuration.hours() && !isoDuration.minutes()) {
    return duration
  }

  // valid ISO 8601 duration
  let durationString = ''
  if (isoDuration.hours()) {
    durationString = durationString.concat(`${isoDuration.hours()} hour${isoDuration.hours() > 1 ? 's' : ''}`)
  }
  if (isoDuration.minutes()) {
    durationString = durationString.concat(` ${isoDuration.minutes()} minute${isoDuration.minutes() > 1 ? 's' : ''}`)
  }

  return durationString
}
