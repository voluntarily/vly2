
const fs = require('fs')
const Cuid = require('cuid')
// any depended upon api services
const postImage = (req, res) => {
  const ImageBin = req.body.image
  const ImageBuffer = Buffer.from(ImageBin, 'binary')
  const uniqueID = Cuid()
  let filename = './static/img/' + uniqueID + '-' + req.body.file
  const result = {
    status: 0,
    message: '',
    imageURL: ''
  }
  fs.writeFile(filename, ImageBuffer, (err) => {
    if (err) {
      // Sorry, I don't know what error to return
      result.status = 418
      result.message = 'I am a tea pot'
      delete result.imageURL
    } else {
      // If the file writer success
      result.status = 200
      result.message = 'Success'
      result.imageURL = './static/img/' + req.body.file
    }
    res.status(result.status).json(result)
  })
}

module.exports = postImage
