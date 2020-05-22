const { expect } = require('chai')
const { I } = inject()

class AttachFile {
  constructor () {
    this.inputFileField = 'input[name=fileUpload]'
    this.fileSize = '.file-size'
    this.fileName = '.file-name'
  }

  async attachFileFrom (path) {
    await I.waitForVisible(this.inputFileField)
    await I.attachFile(this.inputFileField, path)
  }

  async hasFileSize (fileSizeText) {
    await I.waitForElement(this.fileSize)
    const size = await I.grabTextFrom(this.fileSize)
    expect(size).toEqual(fileSizeText)
  }

  async hasFileSizeInPosition (fileNameText, position) {
    await I.waitNumberOfVisibleElements(this.fileName, position)
    const text = await I.grabTextFrom(this.fileName)
    expect(text[position - 1]).toEqual(fileNameText)
  }
}

// For inheritance
exports.AttachFile = AttachFile
module.exports = new AttachFile()
