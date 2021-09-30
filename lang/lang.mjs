import { basename } from 'path'
import glob from 'glob'

// Get the supported languages by looking for translations in the `lang/` dir.
export const supportedLanguages = glob.sync('./lang/*.json')
  .map(f => basename(f, '.json'))
