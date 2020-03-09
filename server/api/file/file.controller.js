const AWS = require('aws-sdk')
const { config } = require('../../../config/serverConfig')

const uploadFile = async (req, res) => {
  try {
    if (!req.session.isAuthenticated) {
      return res.send(403)
    }

    const { data, filename } = req.body

    AWS.config.update({
      accessKeyId: config.AWS_ACCESS_KEY_ID,
      secretAccessKey: config.AWS_SECRET_ACCESS_KEY
    })

    const buffer = Buffer.from(data, 'binary')
    const key = `${Date.now()}-${filename}`
    let bucketName = config.appUrl.replace(/^(https?|ftp|http):\/\//g, '')
    if (bucketName.match(/localhost/g)) {
      bucketName = 'localhost'
    }
    const params = {
      Bucket: `${bucketName}.files`,
      Body: buffer,
      Key: key,
      ACL: 'public-read'
    }

    const s3 = new AWS.S3()
    const result = await s3.upload(params).promise() // Converting callback function to a chain promise function

    // Respond
    res.status(200).json({
      location: result.Location
    })
  } catch (e) {
    console.error(e)
    res.status(400).send({ error: 'Could not upload file' })
  }
}

module.exports = {
  uploadFile
}
