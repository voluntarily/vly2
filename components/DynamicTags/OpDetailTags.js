import { Tag, Input } from 'antd'
import React from 'react'

class EditableTagGroup extends React.Component {
  state = {
    tags: [],
    inputvalue: ''
  }

  render () {
    return <div>
      <Input placeholder='Search skills'
        onChange={this.updateInputValue}
        onPressEnter={this.addTag}
        value={this.state.inputvalue} />
      {this.state.tags.map((tag, index) =>
        <Tag closable
          onClose={() => this.removeTag(tag)}
          key={index}
        >{tag}</Tag>
      )}
    </div>
  }

  updateInputValue = (e) => {
    // console.log(e)
    this.setState({ inputvalue: e.target.value })
  }

  addTag = (e) => {
    // console.log(e)
    e.preventDefault()
    if (!this.state.tags.includes(this.state.inputvalue)) {
      this.setState({ tags: [...this.state.tags, this.state.inputvalue], inputvalue: '' })
    }
  }

  removeTag = removedTag => {
    // console.log(removedTag)
    const tags = this.state.tags.filter(tag => tag !== removedTag)
    // console.log(tags)
    this.setState({ tags })
  };
}

export default EditableTagGroup
