import React, { Component } from 'react'
import { message, Upload, Icon } from 'antd'
import { FormattedMessage } from 'react-intl'

const Dragger = Upload.Dragger
const validImageFile = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg']

function onChangeImageUpload (info) {
  console.log(info)
}

function imageFileCheck (file) {
  const fileType = file.type
  const isImage = validImageFile.includes(fileType)
  if (!isImage) {
    message.error('You can upload only image file')
  }

  const isLessThan2M = file.size / 1024 / 1024 < 2

  if (!isLessThan2M) {
    message.error('You can upload image less than 2 Mb')
  }

  return isImage && isLessThan2M
}

class ImageUpload extends Component {
  render () {
    return (
      <Dragger
        name='file'
        beforeUpload={imageFileCheck}
        // customRequest={this.handleUpload}
        action='/api/postImage'
        onChange={onChangeImageUpload}
        multiple={false}>
        <p className='ant-upload-drag-icon'>
          <Icon type='inbox' />
        </p>
        <FormattedMessage id='imageUploadComponentMessage' defaultMessage='Click or drag file to this area to upload' description='opportunity Title label in OpDetails Form' />
      </Dragger>)
  }
}

export default ImageUpload
