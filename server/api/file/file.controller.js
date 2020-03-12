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
    const bucketName = getBucketName()
    const buffer = Buffer.from(data, 'binary')
    const key = `${Date.now()}-${filename}`

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

/**
 * The name of the S3 bucket this envrionment should use.
 * @returns {string}
 */
function getBucketName () {
  let bucketName = config.appUrl.replace(/^(https?|ftp|http):\/\//g, '')
  if (bucketName.match(/localhost/g)) {
    bucketName = 'localhost'
  }

  return bucketName
}

/**
 * Is the str a valid amazon s3 bucket for this environment.
 * @param {string} str A URL.
 */
function isValidFileUrl (str, bucketName = getBucketName()) {
  if (!str) {
    return false
  }

  try {
    const url = new URL(str)

    return !!(url.hostname.match(/amazonaws.com$/) && url.pathname.startsWith(`/${bucketName}`))
  } catch {
    return false
  }
}

module.exports = {
  uploadFile,
  getBucketName,
  isValidFileUrl
}
