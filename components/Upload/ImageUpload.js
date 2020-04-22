import dynamic from 'next/dynamic'

const ImageUpload = dynamic(() => import('./ImageUploadRaw'), {
  ssr: false
})

export default (props) => <ImageUpload {...props} />
