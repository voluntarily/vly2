import React from 'react'

class RichTextEditor extends React.Component {
  constructor (props) {
    super(props)
    if (document) {
      this.quill = require('react-quill')
    }
  }

  render () {
    const Quill = this.quill
    if (Quill) {
      return (
        <div>
          <Quill defaultValue={this.props.value} onChange={this.props.onChange} />
        </div>
      )
    } else {
      return <textarea />
    }
  }
}

export default RichTextEditor
