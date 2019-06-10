import React, { Component } from 'react'
import { message } from 'antd'
import callApi from '../../lib/apiCaller'
import './imageuploader.less'

// import 'Event'
const { Dashboard } = require('@uppy/react')
const { Plugin } = require('@uppy/core')
const Uppy = require('@uppy/core')
// const validImageFile = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg']

// .uppy-DashboardItem-remove
class UppyPlugin extends Plugin {
  constructor (uppy, opts) {
    super(uppy, opts)
    this.id = opts.id || 'MyPlugin'
    this.type = 'MyPlugin'
    this.onUpload = this.onUpload.bind(this)
  }

  install () {
    this.uppy.addUploader(this.onUpload)
  }

  uninstall () {
    this.uppy.removeUploader(this.onUpload)
  }

  onUpload (fileIDs) {
    var file = this.uppy.getFile(fileIDs[0])
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
    return Promise.resolve()
  }
}

class ImageUpload extends Component {
  TWO_MEGABYTES = 2000000

  state = {
    fileList: []
  }

  constructor (props) {
    super(props)
    // this.onUpload = this.onUpload.bind(this)
    this.uppy = Uppy({
      id: 'uppy',
      autoProceed: true,
      debug: true,
      formData: true,
      restrictions: {
        maxFileSize: 2000000,
        maxNumberOfFiles: 1,
        minNumberOfFiles: 0,
        allowedFileTypes: ['.jpg', '.jpeg', '.png', '.svg']
      },
      meta: {}
    }).use(UppyPlugin, {})
    // this.uppy.on('upload', this.onUpload)
    this.uppy.on('restriction-failed', (file, error) => {
      message.error(error.message)
      console.log(file, error)
      console.log(error)
    })
    // this.uppy.addUploader(this.onUpload)
    // this.uppy.addPostProcessor(() => { return Promise.resolve() })
    // TODO Override other uppy events (file-added, file-removed, upload, upload-progress, upload-success, complete, error, upload-errror, upload-retry, info-visible, info-hidden, cancel-all, restriction-failed)
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
    const up = (process.env.NODE_ENV !== 'test') && <Dashboard uppy={this.uppy} proudlyDisplayPoweredByUppy={false} hideUploadButton />
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
