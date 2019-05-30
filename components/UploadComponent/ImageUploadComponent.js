import React, { Component } from 'react'
import { message, Upload, Icon, Button } from 'antd'
import { FormattedMessage } from 'react-intl'

const fetch = require('isomorphic-fetch')

const validImageFile = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg']

function onChangeImageUpload(info) {
  // console.log(info)
}

const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess('ok')
  }, 0)
}

function imageFileCheck(file) {
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
  constructor(props) {
    super(props)
    this.sendImageToAPI = this.sendImageToAPI.bind(this)
  }
  async sendImageToAPI(file) {
    let FR = new window.FileReader()
    FR.readAsBinaryString(file)
    FR.addEventListener('load', async (e) => {
      const response = await fetch('/api/postImage', {
        headers: { 'content-type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ image: FR.result, file: file.name })
      })
      if (!response.ok) {
        return Promise.reject(new Error(response))
      }
      const json = await response.json()
      // console.log(json)
      this.props.setImageURL(json.imageURL)
    })
  }

  render() {
    const up = (process.env.NODE_ENV !== 'test') &&
      <Upload
        name='file'
        beforeUpload={imageFileCheck}
        action={this.sendImageToAPI}
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
