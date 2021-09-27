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

// }
// class RichTextEditor extends React.Component {
//   componentDidMount () {
//     const isTest = process.env.NODE_ENV === 'test'
//     if (document && !isTest) {
//       this.quill = require('react-quill')
//     }
//   }

//   render () {
//     const isTest = process.env.NODE_ENV === 'test'

//     const toolbarOptions = [
//       ['bold', 'italic', 'underline', 'strike'], // toggled buttons
//       ['blockquote', 'code-block', 'video'],
//       [{ list: 'ordered' }, { list: 'bullet' }],
//       // [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
//       [{ header: [1, 2, 3, 4, 5, 6, false] }],
//       [{ color: [] }, { background: [] }], // dropdown with defaults from theme
//       [{ align: [] }],
//       ['clean'] // remove formatting button
//     ]
//     const modules = {
//       toolbar: toolbarOptions
//     }
//     const Quill = this.quill
//     // TODO: [VP-450] set initial height of the text edit box to be about 3 lines.
//     if (Quill && !isTest) {
//       return (
//         <div>
//           <Quill
//             style={{ lineHeight: '21px' }}
//             // placeholder='Communicate'
//             modules={modules}
//             defaultValue={this.props.value} onChange={this.props.onChange}
//           />
//         </div>
//       )
//     } else {
//       return <textarea />
//     }
//   }
// }

export default RichTextEditor
