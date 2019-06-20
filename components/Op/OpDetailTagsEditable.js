import { Tag, Input } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'

class OpDetailTagsEditable extends React.Component {
  state = {
    inputvalue: ''
  }

  render () {
    return <div>
      <Input placeholder='Search skills'
        onChange={this.updateInputValue}
        onPressEnter={this.addTag}
        value={this.state.inputvalue} />
      {this.props.value ? this.props.value.map(tag =>
        <Tag closable
          onClose={() => this.removeTag(tag)}
          key={tag}
        >{tag}</Tag>
      ) : null}
    </div>
  }

  updateInputValue = (e) => {
    this.setState({ inputvalue: e.target.value })
  }

  addTag = (e) => {
    e.preventDefault()
    if (!this.props.value.includes(this.state.inputvalue)) {
      this.props.onChange([...this.props.value, this.state.inputvalue])
      this.setState({ inputvalue: '' })
    }
  }

  removeTag = removedTag => {
    this.props.onChange(this.props.value.filter(tag => tag !== removedTag))
  };
}

OpDetailTagsEditable.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func
}

export default OpDetailTagsEditable
