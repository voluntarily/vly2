import React from 'react'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false
})

function RichTextEditor ({ value, onChange }) {
  if (process.env.NODE_ENV === 'test') {
    return <textarea />
  }
  return (
    <ReactQuill theme='snow' value={value} onChange={onChange} />
  )
}

export default RichTextEditor
