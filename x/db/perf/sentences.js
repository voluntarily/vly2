const fs = require('fs')
const path = require('path')

const sentencePath = path.join(__dirname, '/sentences.txt')
const sentences = []

fs.readFileSync(sentencePath, 'utf-8').split(/\r?\n/).forEach(line => { sentences.push(line) })

console.log(sentences.length)
