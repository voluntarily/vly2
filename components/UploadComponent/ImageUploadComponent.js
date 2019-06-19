import React, { Component } from 'react'
import { message } from 'antd'
import callApi from '../../lib/apiCaller'
import './imageuploader.less'

const { Dashboard } = require('@uppy/react')
const Uppy = require('@uppy/core')

class ImageUpload extends Component {
  TWO_MEGABYTES = 2000000

  constructor (props) {
    super(props)

    this.uppy = Uppy({
      id: 'uppy',
      autoProceed: true,
      debug: false,
      formData: true,
      restrictions: {
        maxFileSize: this.TWO_MEGABYTES,
        maxNumberOfFiles: 1,
        minNumberOfFiles: 0,
        allowedFileTypes: ['.jpg', '.jpeg', '.png', '.svg']
      },
      meta: {}
    })

    this.onUpload = this.onUpload.bind(this)
    this.uppy.on('file-removed', (e) => { this.props.setImgUrl('') })
    this.uppy.addUploader(this.onUpload)
  }

  onUpload (fileIDs) {
    var file = this.uppy.getFile(fileIDs[0])
    let FR = new window.FileReader()
    var setImgUrl = this.props.setImgUrl
    FR.onloadend = e => {
      callApi('images', 'post', { image: e.currentTarget.result, file: file.name }).then(response => {
        setImgUrl(response.imageUrl)
      },
      error => {
        message.error('An error occured: ' + error.status + ' ' + error.statusText)
      })
    }
    FR.readAsBinaryString(file.data)
  }

  render () {
    const up = (process.env.NODE_ENV !== 'test') &&
    <div onChange={this.onChange}>
      <Dashboard uppy={this.uppy} inline height={100} proudlyDisplayPoweredByUppy={false} hideUploadButton />
    </div>
    return up
  }
}

export default ImageUpload
