const { readFileSync, writeFileSync } = require('fs')
const { resolve } = require('path')
const glob = require('glob')

const messageIdToFileMap = {}

const defaultMessages = glob
  .sync('./lang/.messages/**/*.json')
  .map(filename => [filename, readFileSync(filename, 'utf8')])
  .map(fileInfo => [fileInfo[0], JSON.parse(fileInfo[1])])
  .reduce((messages, fileInfo) => {
    fileInfo[1].forEach(({ id, defaultMessage }) => {
      messageIdToFileMap[id] = messageIdToFileMap[id] || []

      if (
        Object.prototype.hasOwnProperty.call(messages, id) &&
        messages[id] !== defaultMessage
      ) {
        throw new Error(
          `Duplicate message id (${id}) with differing default messages found\n` +
          `Message 1: ${defaultMessage} (${fileInfo[0]})\n` +
          `Message 2: ${messages[id]} (${messageIdToFileMap[id].join(', ')})\n`
        )
      } else if (
        Object.prototype.hasOwnProperty.call(messages, id) &&
        messages[id] === defaultMessage
      ) {
        // duplicate found
        messageIdToFileMap[id].push(fileInfo[0])
      } else {
        messageIdToFileMap[id].push(fileInfo[0])
        messages[id] = defaultMessage
      }
    })

    return messages
  }, {})

// sort object by keys so the en.json file will always have a consistent order
const sortedDefaultMessages = {}

Object.keys(defaultMessages)
  .sort((a, b) => {
    // case insensitive a-z sort
    return a.toLowerCase().localeCompare(b.toLowerCase())
  })
  .forEach((key) => {
    sortedDefaultMessages[key] = defaultMessages[key]
  })

// Report on duplicate message ids
Object.keys(messageIdToFileMap)
  .filter((messageId) => messageIdToFileMap[messageId].length > 1)
  .forEach((messageId) => {
    console.log(`DUPLICATE: ${messageId}`)
    console.log('Files:')
    console.log(messageIdToFileMap[messageId].join('\n') + '\n')
  })

writeFileSync('./lang/en.json', JSON.stringify(sortedDefaultMessages, null, 2))
console.log(`> Wrote default messages to: "${resolve('./lang/en.json')}"`)
