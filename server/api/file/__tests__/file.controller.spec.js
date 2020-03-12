import test from 'ava'
import * as fileController from '../file.controller'

test('isValidFileUrl - valid cases', t => {
  const bucketName = 'dev.voluntarily.nz'

  t.true(fileController.isValidFileUrl('https://s3.ap-southeast-2.amazonaws.com/dev.voluntarily.nz.files/1583966137031-sample.pdf', bucketName))
  t.true(fileController.isValidFileUrl('https://s3.ap-southeast-2.amazonaws.com/dev.voluntarily.nz.files/a.pdf', bucketName))
  t.true(fileController.isValidFileUrl('https://amazonaws.com/dev.voluntarily.nz.files/dev.voluntarily.nz.files/a.pdf', bucketName))
})

test('isValidFileUrl - invalid cases', t => {
  const bucketName = 'dev.voluntarily.nz'

  t.false(fileController.isValidFileUrl('https://s3.ap-southeast-2.amazonaws.org/dev.voluntarily.nz.files/1583966137031-sample.pdf', bucketName))
  t.false(fileController.isValidFileUrl('https://s3.ap-southeast-2.amazonaws.com/test.voluntarily.nz.files/a.pdf', bucketName))
})
