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

// https://nodejs.org/api/url.html#url_url_strings_and_url_objects
// contains a good graphical representation of the URL specification
const getBaseUrl = () => `${window.location.protocol}//${window.location.host}`

const getPathAndHash = () => {
  const pathName = window.location.pathname
  const search = window.location.search
  const hash = window.location.hash
  return `${pathName}${search}${hash}`
}

module.exports = {
  defaultToHttpScheme,
  getBaseUrl,
  getPathAndHash
}
