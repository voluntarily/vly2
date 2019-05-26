import React, { Component } from 'react'
import { message, Upload, Icon } from 'antd'
import { FormattedMessage } from 'react-intl'
/* global fetch */
import 'isomorphic-fetch'

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
  // constructor (props) {
  //   super(props)
  //   this.state = { filenamePrepend: props.filenamePrepend }
  // }
  sendImageToAPI (file) {
    console.log(file)
    let FR = new window.FileReader()
    FR.readAsBinaryString(file)
    FR.addEventListener('load', (e) => {
      const response = fetch('/api/postImage', {
        headers: {},
        method: 'POST',
        body: { image: FR.result, file: file.name } })
      if (!response.ok) {
        return Promise.reject(response)
      }
      const json = response.json()
      return json
    })
  }

  render () {
    return (
      <Dragger
        name='file'
        beforeUpload={imageFileCheck}
        action={this.sendImageToAPI}
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
