import test from 'ava'
import * as fileController from '../file.controller'

test('isValidFileUrl - valid cases', t => {
  fileController.getBucketName = () => 'dev.voluntarily.nz'

  t.true(fileController.isValidFileUrl('https://s3.ap-southeast-2.amazonaws.com/dev.voluntarily.nz.files/1583966137031-sample.pdf'))
  t.true(fileController.isValidFileUrl('https://s3.ap-southeast-2.amazonaws.com/dev.voluntarily.nz.files/a.pdf'))
  t.true(fileController.isValidFileUrl('https://amazonaws.com/dev.voluntarily.nz.files/dev.voluntarily.nz.files/a.pdf'))
})

test('isValidFileUrl - invalid cases', t => {
  fileController.getBucketName = () => 'dev.voluntarily.nz'

  t.false(fileController.isValidFileUrl('https://s3.ap-southeast-2.amazonaws.org/dev.voluntarily.nz.files/1583966137031-sample.pdf'))
  t.false(fileController.isValidFileUrl('https://s3.ap-southeast-2.amazonaws.com/test.voluntarily.nz.files/a.pdf'))
})
