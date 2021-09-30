const { basename } = require('path')
const glob = require('glob')

// Get the supported languages by looking for translations in the `lang/` dir.
const supportedLanguages = glob
  .sync('./lang/*.json')
  .map(f => basename(f, '.json'))

module.exports = {
  supportedLanguages
}
