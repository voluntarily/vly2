import { Icon, Upload } from 'antd'

const Dragger = Upload.Dragger
const ImageUpload = (props) => {
  return (
    <Dragger
      customRequest={props.customRequest}
      beforeUpload={props.beforeUpload}
      onChange={props.onChange}
      multiple={false}>
      <p className='ant-upload-drag-icon'>
        <Icon type='inbox' />
      </p>
      <p className='ant-upload-text'>Click or drag file to this area to upload</p>
    </Dragger>
  )
}

export default ImageUpload
