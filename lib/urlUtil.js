/**
 * Ensures that the URL string begins with either http or https scheme if no scheme is supplied.
 * @param {string} url A URL.
 */
const defaultToHttpScheme = (url) => {
  url = (url || '').trim()

  if (!url) {
    return ''
  }

  if (/^.+:\/\//.test(url)) {
    return url
  }

  if (!/^https?:\/\//.test(url)) {
    return `http://${url}`
  }

  return url
}

module.exports = {
  defaultToHttpScheme
}
