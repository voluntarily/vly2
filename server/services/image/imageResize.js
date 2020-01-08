const sharp = require('sharp')

/**
 * Resize an image.
 * @param {Buffer} imageBuffer A buffer object of the image data.
 * @param {Number} width
 * @param {Number} height
 */
const resizeImage = async (imageBuffer, width, height) => {
    let resizedImage = sharp(imageBuffer)

    if (width || height)
        resizedImage = resizedImage.resize(width, height, {
            fit: 'inside'
        })

    return new Promise((resolve, reject) => {
        resizedImage
            .png()
            .toBuffer((err, data, info) => {
                if (err) {
                    reject()
                }
                else {
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
