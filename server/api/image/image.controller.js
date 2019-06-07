const fs = require('fs')
const cuid = require('cuid')
const slug = require('slug')
// any depended upon api services
const postImage = (req, res) => {
  try {
    const ImageBin = req.body.image
    const ImageBuffer = Buffer.from(ImageBin, 'binary')
    const uniqueID = cuid()
    slug.defaults.mode = 'rfc3986'
    const uploadURL = `/static/upload${(process.env.NODE_ENV === 'test') ? '-test' : ''}`
    const uploadPath = `.${uploadURL}`
    !fs.existsSync(uploadPath) && fs.mkdirSync(uploadPath)

    const filename = `${uploadURL}/${uniqueID}-${slug(req.body.file)}`
    const fqp = `.${filename}`
    const result = {
      status: 200,
      message: 'OK',
      imageURL: filename
    }
    fs.writeFile(fqp, ImageBuffer, (err) => {
      (err)
        ? res.status(500).json('Could not save the image')
        : res.status(result.status).json(result)
    })
  } catch (e) {
    // console.log(e)
    res.status(400).send({ error: 'Bad Request' })
  }
}

module.exports = postImage
