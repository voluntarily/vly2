
const fs = require('fs')
// check a bunch of things here like whether the db is connected and responding.
// any depended upon api services
const postImage = (req, res) => {
  const ImageBin = req.body.image
  const ImageBuffer = Buffer.from(ImageBin, 'binary')

  const result = {
    status: 0,
    message: '',
    imageUR: ''
  }
  fs.writeFile('./static/img/' + req.body.file, ImageBuffer, (err) => {
    if (err) {
      result.status = 418
      result.message = 'I am a tea pot'
    } else {
      console.log('success')
      result.status = 200
      result.message = 'Success'
      result.imageURL = './static/img/' + req.body.file
    }
    res.status(result.status).json(result)
  })
}

module.exports = postImage
