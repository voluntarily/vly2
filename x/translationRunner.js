// translationRunner.js
// import manageTranslations from 'react-intl-translations-manager';
const manageTranslations = require('react-intl-translations-manager').default

manageTranslations({
  messagesDirectory: 'build/messages',
  translationsDirectory: 'Intl/localizationData/',
  languages: ['en', 'mi'] // any language you need
})
