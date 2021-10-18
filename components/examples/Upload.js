import { UploadOutlined } from '@ant-design/icons'
import { Button, message, Upload } from 'antd'
import { Component } from 'react'
// import { JSDOM } from 'jsdom'
// const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`)
// global.window = dom// setting a mock window global object so the upload image component is not complaining
// global.SVGElement = Array

export default class Uploader extends Component {
  pprops = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text'
    },
    isTest: process.env.NODE_ENV === 'test',
    onChange (info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    }
  }

  render () {
    const body = (process.env.NODE_ENV !== 'test') &&
      <Upload {...this.pprops}>
        <Button>
          <UploadOutlined />Click to Upload
        </Button>
      </Upload>

    return (
      <div>
        <p>File Uploader</p>
        {body}
      </div>
    )
  }
}
