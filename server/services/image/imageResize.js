const sharp = require('sharp')

/**
 * Resize an image.
 * @param {Buffer} imageBuffer A buffer object of the image data.
 * @param {Number} width The width of the resized image.
 * @param {Number} height The height of the resized image.
 */
const resizeImage = async (imageBuffer, width, height) => {
  let resizedImage = sharp(imageBuffer)

  if (width || height) {
    resizedImage = resizedImage.resize(width, height, {
      fit: 'inside'
    })
  }

  return new Promise((resolve, reject) => {
    resizedImage
      .png()
      .toBuffer((err, data, info) => {
        if (err) {
          reject(err)
        } else {
          resolve({
            data,
            info
          })
        }
      })
  })
}

module.exports = {
  resizeImage
}
