const fs = require('fs-extra')
const path = require('path')
const cuid = require('cuid')
const slug = require('slug')
const { config } = require('../../../config/config')
const { cloudUploadService } = require('./cloudImageUpload')
const { resizeImage } = require('../../services/image/imageResize')

/**
 * @type {Map<String, {
    name: string,
    width: Number,
    height: Number
  }[]>}
 */
const _usages = new Map()

const uploadImage = async (req, res) => {
  try {
    const { image: imageBin, file: originalFilename } = req.body
    const imageBuffer = Buffer.from(imageBin, 'binary')

    // 1. Store the original file - do this so we can always go back and re-process the raw file
    // 2. Then recreate it at full dimensions to strip out any embedded data and meta information (such as GPS coords.)
    //    This is the file we will serve publicly and not the original file
    // 3. If the intended usage of this image is known, then produce specific size variants, such as for the
    //    profile photo we need a tiny image and a full size image and the frontend will request the approp. one.

    // Store the raw file
    const originalFile = storeAsync(imageBuffer, originalFilename)
    // Regenerate the image
    const originalRegenerated = resizeAndStoreAsync(imageBuffer, undefined, undefined, originalFilename, 'full')

    // Create any size variants
    const usages = _usages.get(req.body.usages) || []
    const usageTasks = usages.map(usage =>
      resizeAndStoreAsync(imageBuffer, usage.width, usage.height, originalFilename, usage.name)
    )

    // Wait for all our storage/resize operations to finish
    const imageUrls = await Promise.all([originalFile, originalRegenerated, ...usageTasks])
    const [, imageUrl, ...usageUrls] = imageUrls

    const result = {
      status: 200, // TODO: Remove - this as we should just use HTTP status code
      message: 'OK', // TODO: Remove - the HTTP status code is enough to indicate success
      imageUrl,
      sizeVariants: Object.fromEntries(usageUrls.map((variant, index) => [usages[index].name, variant]))
    }

    // Respond
    res.status(200).json(result)
  } catch (e) {
    // console.error('Upload Image error:', e)
    res.status(400).send({ error: 'Could not upload image' })
  }
}

/***
 * @param imageBuffer {Buffer} A buffer object of the image data.
 * @param width {Number} The desired pixel width of the image.
 * @param height {Number} The desired pixel height of the image.
 * @param originalFilename {string} The original filename.
 * @param sizeVariantName {string} The name for this size variant (e.g. small, large etc).
 */
const resizeAndStoreAsync = async (imageBuffer, width, height, originalFilename, sizeVariantName) => {
  const { data: resizedImage } = await resizeImage(imageBuffer, width, height)

  const name = path.parse(originalFilename).name
  const filename = `${name}_${sizeVariantName}.png`

  return await storeAsync(resizedImage, filename)
}

/***
 * @param {Buffer} imageBuffer A buffer object of the image data.
 * @param {String} filename The filename to save the image as.
 */
const storeFileSystemAsync = async (imageBuffer, filename) => {
  const uniqueID = cuid()
  slug.defaults.mode = 'rfc3986'
  const uploadUrl = `/static/upload${(process.env.NODE_ENV === 'test') ? '-test' : ''}`
  const uploadPath = `./public${uploadUrl}`

  if (!(await fs.exists(uploadPath))) {
    await fs.mkdir(uploadPath)
  }

  const publicPath = `${uploadUrl}/${uniqueID}-${slug(filename)}`
  const serverPath = `./public${publicPath}`

  await fs.writeFile(serverPath, imageBuffer)

  return publicPath
}
/**
 *
 * @param {Buffer} imageBuffer A buffer object of the image data.
 * @param {String} filename The filename to save the image as.
 */
const storeAwsAsync = async (imageBuffer, filename) => {
  return await cloudUploadService({ image: imageBuffer, file: filename })
}

/**
 * Where should files be stored?
 */
const getStorageLocation = () => {
  // If AWS is configured, store there otherwise use the file system
  if (config.AWS_ACCESS_KEY_ID && config.AWS_SECRET_ACCESS_KEY) {
    return 'aws'
  } else {
    return 'fs'
  }
}

/**
 *
 * @param {Buffer} imageBuffer A buffer object of the image data.
 * @param {String} filename The filename to save the image as.
 */
const storeAsync = async (imageBuffer, filename) => {
  const location = getStorageLocation()

  switch (location) {
    case 'fs':
      return await storeFileSystemAsync(imageBuffer, filename)
    case 'aws':
      return await storeAwsAsync(imageBuffer, filename)

    default:
      throw new Error(`Unknown storage location key: '${location}'`)
  }
}

/**
 *
 * @param {string} name
 * @param {{
    name: string,
    width: Number,
    height: Number
  }[]} sizeVariants
 */
const registerUsage = (name, sizeVariants) => {
  _usages.set(name, sizeVariants)
}

registerUsage('profile-photo', [
  {
    name: 'sm',
    width: 24,
    height: 24
  },
  {
    name: 'lg',
    width: 256,
    height: 256
  }
])

module.exports = {
  uploadImage
}
