import React, { Component } from 'react'
import { message, Button } from 'antd'
import callApi from '../../lib/apiCaller'
import './imageuploader.less'

const { Dashboard } = require('@uppy/react')
const Uppy = require('@uppy/core')
// const validImageFile = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg']

// .uppy-DashboardItem-remove

class ImageUpload extends Component {
  TWO_MEGABYTES = 2000000

  state = {
    fileList: []
  }

  constructor (props) {
    super(props)
    this.onUpload = this.onUpload.bind(this)
    this.uppy = Uppy({
      id: 'uppy',
      autoProceed: true,
      allowMultipleUploads: false,
      debug: true,
      formData: true,
      restrictions: {
        maxFileSize: 2000000,
        maxNumberOfFiles: 1,
        minNumberOfFiles: 0,
        allowedFileTypes: ['.jpg', '.jpeg', '.png', '.svg']
      },
      meta: {}
    })
    this.uppy.on('upload', this.onUpload)
    this.uppy.on('restriction-failed', (file, error) => {
      message.error(error.message)
      console.log(file, error)
      console.log(error)
    })
    // TODO Override other uppy events (file-added, file-removed, upload, upload-progress, upload-success, complete, error, upload-errror, upload-retry, info-visible, info-hidden, cancel-all, restriction-failed)
  }

  onUpload (data) {
    var file = this.uppy.getFile(data.fileIDs[0])
    console.log(file)
    let FR = new window.FileReader()
    FR.onloadend = e => {
      callApi('images', 'post', { image: e.currentTarget.result, file: file.name }).then(response => {
        console.log('Success! ' + response)
      },
      error => {
        message.error('An error occured: ' + error.status + ' ' + error.statusText)
      })
    }
    FR.readAsBinaryString(file.data)
  }
  // this.onChangeImageUpload = this.onChangeImageUpload.bind(this)
  // this.uploadCustomRequest = this.uploadCustomRequest.bind(this)

  // onChangeImageUpload (info) {
  //   const fileType = info.file.type
  //   const isImage = validImageFile.includes(fileType)

  //   if (info.file.size > this.TWO_MEGABYTES) {
  //     message.error('You can only upload image files less than 2 Mb')
  //     this.setState({ fileList: [] })
  //   } else if (!isImage) {
  //     message.error('You can upload only image files')
  //     this.setState({ fileList: [] })
  //   } else {
  //     let fileList = [...info.fileList]
  //     fileList = fileList.slice(-1)
  //     this.setState({ fileList })
  //   }
  // }

  render () {
    const up = (process.env.NODE_ENV !== 'test') && <Dashboard uppy={this.uppy} proudlyDisplayPoweredByUppy={false} />
    // <Upload
    //   fileList={this.state.fileList}
    //   name='file'
    //   onChange={this.onChangeImageUpload}
    //   showUploadList
    //   customRequest={this.uploadCustomRequest}
    //   multiple={false}>
    //   <Button
    //     className='ant-upload-drag-button'
    //     accessibilityLabel='Image upload button'>
    //     <Icon type='upload' />Click to Upload!
    //   </Button>
    // </Upload>
    return up
  }
}

export default ImageUpload
