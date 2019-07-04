import React from 'react'

class RichTextEditor extends React.Component {
  componentWillMount () {
    if (document) {
      this.quill = require('react-quill')
    }
  }
  render () {
    // var toolbarOptions = [['bold', 'italic', 'underline', 'strike'], ['link', 'image']]
    var toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent

      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],

      ['clean'] // remove formatting button
    ]
    const modules = {
      toolbar: toolbarOptions
    }
    const Quill = this.quill
    if (Quill) {
      return (
        <div>
          <Quill
            placeholder='Communicate'
            modules={modules}
            defaultValue={this.props.value} onChange={this.props.onChange}
          />
        </div>
      )
    } else {
      return <textarea />
    }
  }
}

export default RichTextEditor
