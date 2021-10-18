const AWS = require('aws-sdk')
const fs = require('fs')
const { config } = require('../../../config/serverConfig')
const cuid = require('cuid')
const slug = require('slug')
const path = require('path')

const uploadFile = async (req, res) => {
  try {
    if (!req.session.isAuthenticated) {
      return res.sendStatus(403)
    }

    const { data, filename } = req.body
    const buffer = Buffer.from(data, 'binary')

    let location
    if (config.env === 'development') {
      location = await uploadToFileSystem(buffer, filename)
    } else {
      location = await uploadToS3(buffer, filename)
    }

    // Respond
    res.status(200).json({
      location
    })
  } catch (e) {
    console.error(e)
    res.status(400).send({ error: 'Could not upload file' })
  }
}

async function uploadToFileSystem (buffer, filename) {
  const uniqueID = cuid()
  const uploadUrl = '/static/upload'
  const uploadPath = `./public${uploadUrl}`

  if (!(fs.existsSync(uploadPath))) {
    fs.mkdirSync(uploadPath)
  }

  const name = path.parse(filename)

  const publicPath = `${uploadUrl}/${uniqueID}-${slug(name.name)}${name.ext}`
  const serverPath = `./public${publicPath}`

  fs.writeFileSync(serverPath, buffer)

  return publicPath
}

/**
 * @param {Buffer} buffer A buffer containing the binary of the file.
 * @param {string} filename The filename of the file to be uploaded.
 */
async function uploadToS3 (buffer, filename) {
  AWS.config.update({
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY
  })
  const bucketName = getBucketName()
  const key = `${Date.now()}-${filename}`

  const params = {
    Bucket: `${bucketName}.files`,
    Body: buffer,
    Key: key,
    ACL: 'public-read'
  }

  const s3 = new AWS.S3()
  const result = await s3.upload(params).promise() // Converting callback function to a chain promise function

  return result.Location
}

/**
 * The name of the S3 bucket this envrionment should use.
 * @returns {string}
 */
function getBucketName () {
  return config.appUrl.replace(/^(https?|ftp|http):\/\//g, '')
}

/**
 * Is the str a valid upload URL for this environment.
 * @param {string} str A URL.
 */
function isValidFileUrl (str) {
  // Locally files are uploaded to the filesystem so we allow any URL, but other environments we need to check
  return config.env === 'development' || isValidS3Url(str)
}

/**
 * Is the str a valid amazon s3 bucket for this environment.
 * @param {string} str A URL.
 */
function isValidS3Url (str, bucketName = getBucketName()) {
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
  isValidS3Url,
  isValidFileUrl
}
