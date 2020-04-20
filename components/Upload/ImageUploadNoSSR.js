import dynamic from 'next/dynamic'

const ImageUpload = dynamic(() => import('./ImageUpload'), {
  ssr: false
})

export default () => <ImageUpload />
