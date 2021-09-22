import dynamic from 'next/dynamic'

const ImageUpload = dynamic(() => import('./ImageUploadRaw'), {
  ssr: false
})

const ImageUploadComponent = props => <ImageUpload {...props} />

export default ImageUploadComponent
