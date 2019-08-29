const AWS = require('aws-sdk')

const { config } = require('../../../config/config')

const cloudUploadService = async (imageObject) => {
  const { image: imageBase64, file: filename } = imageObject
  AWS.config.update({
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_ACCESS_KEY_SECRET
  })
  const imageBuffer = Buffer.from(imageBase64, 'binary')
  const imageKey = process.env.NODE_ENV === 'test' ? `unitTest/${Date.now()}-${filename}` : `${Date.now()}-${filename}`
  const params = {
    Bucket: `${config.S3_BUCKET_NAME}`,
    Body: imageBuffer,
    Key: imageKey,
    ACL: 'public-read'
  }
  const s3 = new AWS.S3()
  let result
  try {
    result = await s3.upload(params).promise() // Converting callback function to a chain promise function
  } catch (e) {
    console.error(e)
    return null
  }
  return result.Location
}

module.exports = {
  cloudUploadService
}
