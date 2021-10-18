import { message } from 'antd'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import callApi from '../../lib/callApi'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import styled from 'styled-components'

const { Dashboard } = require('@uppy/react')
const Uppy = require('@uppy/core')

const UploadingBadge = styled.div`
  display: none;
  position: absolute;
  right: 0;
  top: 0;
  transition: top 0.2s ease-in;
  background: ${props => `${props.theme.main}`};
  padding: 8px 10px;
  border-radius: 4px;
  color: white;
  font-size: smaller;
  line-height: normal;

  @keyframes uploading
  {
    from
    {
      top: 0;
    }
    to
    {
      top: -35px;
    }
  }

  &[data-uploading]
  {
    display: block;
    animation: uploading 0.2s forwards;
  }
`
const FileUploadWrapper = styled.div`
  position: relative;
`

class FileUpload extends Component {
  TWO_MEGABYTES = 2000000

  constructor (props) {
    super(props)

    // Maps a Promise<Response> to whether it's complete (bool)
    this.uploadStatus = new Map()

    // Map the uppy filename to the s3 bucket URL (once uploaded)
    this.filenameToLocationUrlMap = new Map()

    this.uppy = new Uppy({
      id: 'uppy',
      autoProceed: true,
      debug: false,
      formData: true,
      restrictions: {
        maxFileSize: props.maxFileSize || this.TWO_MEGABYTES,
        maxNumberOfFiles: props.maxNumberOfFiles,
        minNumberOfFiles: 0,
        allowedFileTypes: props.allowedFileTypes
      },
      meta: {}
    })

    if (props.files) {
      for (const file of props.files) {
        this.uppy.addFile({
          name: file.filename,
          data: {
            name: file.filename
          }
        })

        this.filenameToLocationUrlMap.set(file.filename, file.location)
      }
    }

    this.uppy.on('file-added', this.uploadFile.bind(this))
    this.uppy.on('file-removed', () => this.raiseFilesChanged())

    this.state = {
      uploading: false
    }
  }

  uploadFile (event) {
    const fileReader = new window.FileReader()

    fileReader.onloadend = async e => {
      let responsePromise
      try {
        responsePromise = callApi('files', 'post', {
          data: e.currentTarget.result,
          filename: event.name
        })

        this.setUploadStatus(responsePromise, false)
        const response = await responsePromise
        this.setUploadStatus(responsePromise, true)
        this.filenameToLocationUrlMap.set(event.name, response.location)
        this.raiseFilesChanged()
      } catch (error) {
        // If we failed to upload the file
        // Then remove it from uppy
        this.uppy.removeFile(event.id)

        // And set that request as completed
        if (responsePromise) {
          this.setUploadStatus(responsePromise, true)
        }

        console.error(error)
        message.error('An error occured uploading file')
      }
    }

    fileReader.readAsBinaryString(event.data)
  }

  setUploadStatus (responsePromise, completed) {
    this.uploadStatus.set(responsePromise, completed)
    this.onUploadEvent()
  }

  onUploadEvent () {
    const uploading = this.uploadStatus.size > 0 &&
      Array.from(this.uploadStatus.values()).filter(complete => !complete).length > 0

    this.setState({ uploading })

    if (this.props.onUploadingStatusChanged) {
      this.props.onUploadingStatusChanged(uploading)
    }
  }

  raiseFilesChanged () {
    if (this.props.onFilesChanged) {
      this.props.onFilesChanged(this.uppy.getFiles().map(file => ({
        ...file,
        location: this.filenameToLocationUrlMap.get(file.name)
      })))
    }
  }

  render () {
    const up = (process.env.NODE_ENV !== 'test') &&
      <FileUploadWrapper>
        <UploadingBadge data-uploading={this.state.uploading ? true : undefined}>Uploading...</UploadingBadge>
        <Dashboard uppy={this.uppy} inline width='100%' height={200} proudlyDisplayPoweredByUppy={false} hideUploadButton />
      </FileUploadWrapper>
    return up
  }
}

FileUpload.propTypes = {
  maxFileSize: PropTypes.number,
  maxNumberOfFiles: PropTypes.number,
  allowedFileTypes: PropTypes.arrayOf(PropTypes.string),
  onFilesChanged: PropTypes.func,
  onUploadingStatusChanged: PropTypes.func
}

export default FileUpload
