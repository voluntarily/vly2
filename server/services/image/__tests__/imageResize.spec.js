import test from 'ava'
import fs from 'fs'
import path from 'path'
// import sharp from 'sharp'
// import exifReader from 'exif-reader'
const { resizeImage } = require('../imageResize')

test.skip('Image resize - reduce width and height, maintain aspect ratio', async t => {
  const imageBuffer = fs.readFileSync(path.join(__dirname, '/ferrari_1920x1200.jpg'))

  const { data: resizedImage, info } = await resizeImage(imageBuffer, 256, 256)

  t.truthy(!!resizedImage)
  t.is(info.width, 256)
  t.is(info.height, 160)
})

test.skip('Image resize - original size', async t => {
  const imageBuffer = fs.readFileSync(path.join(__dirname, '/ferrari_1920x1200.jpg'))

  const { data: resizedImage, info } = await resizeImage(imageBuffer, undefined, undefined)

  t.truthy(!!resizedImage)
  t.is(info.width, 1920)
  t.is(info.height, 1200)
})

test.skip('Image resize - metadata is removed', async t => {
  // Read a file with exif metadata and resize it
  // const imageBuffer = fs.readFileSync(path.join(__dirname, '/Canon_DIGITAL_IXUS_400.jpg'))
  // const exif = exifReader((await sharp(imageBuffer).metadata()).exif)
  // t.is(exif.image.Make, 'Canon')
  // t.is(exif.exif.FNumber, 10)

  // // Ensure that metadata is removed
  // const { data: resizedImage } = await resizeImage(imageBuffer, undefined, undefined)
  // const resizedExif = (await sharp(resizedImage).metadata()).exif
  // t.is(resizedExif, undefined)
})
