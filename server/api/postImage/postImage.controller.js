
const fs = require('fs')
const Cuid = require('cuid')
// any depended upon api services
const postImage = (req, res) => {
  const ImageBin = req.body.image
  const ImageBuffer = Buffer.from(ImageBin, 'binary')
  const uniqueID = Cuid()
  let filename = `/static/upload/${uniqueID}-${req.body.file}`
  const fqp = `.${filename}`
  const result = {
    status: 0,
    message: '',
    imageURL: ''
  }
  fs.writeFile(fqp, ImageBuffer, (err) => {
    if (err) {
      console.error('writefile error', err)
      result.status = 500
      result.message = 'Could not save the image'
      delete result.imageURL
    } else {
      // If the file writer success
      result.status = 200
      result.message = 'Success'
      result.imageURL = filename
    }
    res.status(result.status).json(result)
  })
}

module.exports = postImage
