const fs = require('fs')
const cuid = require('cuid')
const slug = require('slug')
const { config } = require('../../../config/config')
const { cloudUploadService } = require('./cloudImageUpload')
// any depended upon api services
const imageController = async (req, res) => {
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
    if (config.AWS_ACCESS_KEY && config.AWS_ACCESS_KEY_SECRET) {
      result.imageUrl = await cloudUploadService(req.body)
    } else {
      fs.writeFile(fqp, ImageBuffer, (err) => {
        if (err) throw err
      })
    }
    res.status(200).json(result)
  } catch (e) {
    console.log(e)
    res.status(400).send({ error: 'Could not upload image' })
  }
}

module.exports = imageController
