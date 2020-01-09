import test from 'ava'
import fs from 'fs'
const { resizeImage } = require('../imageResize')

test('Image resize - reduce width and height, maintain aspect ratio', async t => {
  const imageBuffer = fs.readFileSync(__dirname + '/ferrari_1920x1200.jpg')

  const { data: resizedImage, info } = await resizeImage(imageBuffer, 256, 256)

  t.truthy(!!resizedImage)
  t.is(info.width, 256)
  t.is(info.height, 160)
})

test('Image resize - original size', async t => {
  const imageBuffer = fs.readFileSync(__dirname + '/ferrari_1920x1200.jpg')

  const { data: resizedImage, info } = await resizeImage(imageBuffer, undefined, undefined)

  t.truthy(!!resizedImage)
  t.is(info.width, 1920)
  t.is(info.height, 1200)
})
