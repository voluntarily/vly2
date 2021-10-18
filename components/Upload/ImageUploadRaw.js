import { Button, message } from 'antd'
import React, { Component } from 'react'
import callApi from '../../lib/callApi'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import '@uppy/webcam/dist/style.css'
import { FormattedMessage } from 'react-intl'

import { DashboardModal } from '@uppy/react'
// const { Dashboard } = require('@uppy/react')
import Uppy from '@uppy/core'
import Webcam from '@uppy/webcam'

class ImageUpload extends Component {
  TWO_MEGABYTES = 2000000

  constructor (props) {
    super(props)
    this.state = {
      modalOpen: false
    }
    this.onUpload = this.onUpload.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    if (process.env.NODE_ENV !== 'test') {
      this.uppy = new Uppy({
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
      this.uppy.on('file-removed', (e) => { this.props.setImgUrl('') })
      this.uppy.use(Webcam, {
      // Options
        modes: [
          'picture'
        ]
      })
      // this.uppy.use(Url)
      this.uppy.addUploader(this.onUpload)
    }
  }

  handleOpen () {
    this.setState({
      modalOpen: true
    })
  }

  handleClose () {
    this.setState({
      modalOpen: false
    })
  }

  onUpload (fileIDs) {
    const file = this.uppy.getFile(fileIDs[0])
    const FR = new window.FileReader()
    const setImgUrl = this.props.setImgUrl
    FR.onloadend = e => {
      callApi('images', 'post', { image: e.currentTarget.result, file: file.name, usages: this.props.usages }).then(response => {
        setImgUrl(response.imageUrl, response.sizeVariants)
      },
      error => {
        message.error('An error occured: ' + error.status + ' ' + error.statusText)
      })
    }
    FR.readAsBinaryString(file.data)
    this.handleClose()
  }

  render () {
    const up = (process.env.NODE_ENV !== 'test') &&
      <>
        <Button shape='round' onClick={this.handleOpen}>
          <FormattedMessage
            id='ImageUpload.button'
            defaultMessage='Upload Photo'
          />
        </Button>
        <DashboardModal
          uppy={this.uppy}
          proudlyDisplayPoweredByUppy={false}
          closeModalOnClickOutside
          open={this.state.modalOpen}
          onRequestClose={this.handleClose}
          plugins={['Webcam']}
        />
      </>
    return up
  }
}

export default ImageUpload
