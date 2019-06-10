const fs = require('fs')
const cuid = require('cuid')
const slug = require('slug')
// any depended upon api services
const imageController = (req, res) => {
  try {
    const ImageBin = req.body.image
    const ImageBuffer = Buffer.from(ImageBin, 'binary')
    const uniqueID = cuid()
    slug.defaults.mode = 'rfc3986'
    const uploadUrl = `/static/upload${(process.env.NODE_ENV === 'test') ? '-test' : ''}`
    const uploadPath = `.${uploadUrl}`
    !fs.existsSync(uploadPath) && fs.mkdirSync(uploadPath)

    const filename = `${uploadUrl}/${uniqueID}-${slug(req.body.file)}`
    const fqp = `.${filename}`
    const result = {
      status: 200,
      message: 'OK',
      imageUrl: filename
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

module.exports = imageController
