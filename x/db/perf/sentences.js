const fs = require('fs')

const path = `${import.meta.url}/sentences.txt`
const sentences = []

fs.readFileSync(path, 'utf-8').split(/\r?\n/).forEach(line => { sentences.push(line) })

console.log(sentences.length)
