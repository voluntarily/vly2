const AWS = require('aws-sdk')

const { config } = require('../../../config/config')

const cloudUploadService = async (imageObject) => {
  const { image: imageBase64, file: filename } = imageObject
  AWS.config.update({
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY
  })
  const imageBuffer = Buffer.from(imageBase64, 'binary')
  const imageKey = process.env.NODE_ENV === 'test' ? `unitTest/${Date.now()}-${filename}` : `${Date.now()}-${filename}`
  let bucketName = config.appUrl.replace(/^(https?|ftp|http):\/\//g, '')
  if (bucketName.match(/localhost/g)) bucketName = 'localhost'
  const params = {
    Bucket: `${bucketName}.images`,
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
