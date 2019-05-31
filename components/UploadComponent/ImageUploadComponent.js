import React, { Component } from 'react'
import { message, Upload, Icon, Button } from 'antd'
import callApi from '../../lib/apiCaller'

const validImageFile = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg']

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
  state = {
    fileList: []
  }

  constructor (props) {
    super(props)
    this.handleImageUpload = this.handleImageUpload.bind(this)
    this.sendImageToAPI = this.sendImageToAPI.bind(this)
    this.onChangeImageUpload = this.onChangeImageUpload.bind(this)
  }

  handleImageUpload (file) {
    let FR = new window.FileReader()
    FR.onloadend = this.sendImageToAPI
    FR.readAsBinaryString(file)
  }

  sendImageToAPI (e) {
    callApi('postImage', 'post', { image: e.currentTarget.result, file: 'img.png' }).then(response => {
      console.log('Success!')
    },
    error => {
      console.log('Error: ' + error.statusText)
    })
  }

  onChangeImageUpload (info) {
    let fileList = [...info.fileList]
    fileList = fileList.slice(-1)
    this.setState({ fileList })
  }

  render () {
    const up = (process.env.NODE_ENV !== 'test') &&
      <Upload
        fileList={this.state.fileList}
        name='file'
        beforeUpload={imageFileCheck}
        action={this.handleImageUpload}
        onChange={this.onChangeImageUpload}
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
