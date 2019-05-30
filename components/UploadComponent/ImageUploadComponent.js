import React, { Component } from 'react'
import { message, Upload, Icon, Button } from 'antd'
import { FormattedMessage } from 'react-intl'

const fetch = require('isomorphic-fetch')

const validImageFile = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg']

function onChangeImageUpload (info) {
  // console.log(info)
}

const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess('ok')
  }, 0)
}

function imageFileCheck (file) {
  const fileType = file.type
  const isImage = validImageFile.includes(fileType)
  if (!isImage) {
    message.error('You can upload only image files')
  }

  const isLessThan2M = file.size / 1024 / 1024 < 2

  if (!isLessThan2M) {
    message.error('You can only upload image files less than 2 Mb')
  }

  return isImage && isLessThan2M
}

class ImageUpload extends Component {
  constructor (props) {
    super(props)
    this.handleImageUpload = this.handleImageUpload.bind(this)
    this.sendImageToAPI = this.sendImageToAPI.bind(this)
  }

  handleImageUpload (file) {
    let FR = new window.FileReader()
    FR.onloadend = this.sendImageToAPI
    FR.readAsBinaryString(file)
  }

  sendImageToAPI (e) {
    fetch('/api/postImage', {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ image: e.currentTarget.result, file: 'img.png' }) })
      .then(response => {
        if (response.ok) {
          console.log('Success :)')
        } else {
          console.log('Failed :(')
        }
      },
      error => {
        console.log('Failed to fetch with the following error: ' + error)
      })
  }

  render () {
    const up = (process.env.NODE_ENV !== 'test') &&
      <Upload
        name='file'
        beforeUpload={imageFileCheck}
        action={this.handleImageUpload}
        onChange={onChangeImageUpload}
        showUploadList
        customRequest={dummyRequest}
        multiple={false}>
        <Button
          className='ant-upload-drag-button'
          accessibilityLabel='Image upload button'>
          <Icon type='upload' />Click to Upload!
        </Button>
      </Upload>
    return up
  }
}

export default ImageUpload
