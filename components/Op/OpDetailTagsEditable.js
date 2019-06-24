import { Tag, AutoComplete } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'

const { Option } = AutoComplete

class OpDetailTagsEditable extends React.Component {
  state = {
    inputvalue: '',
    matchingTags: []
  }

  render () {
    const { matchingTags, inputvalue } = this.state
    const children = matchingTags.map(tag => <Option key={tag}>{tag}</Option>)
    if (inputvalue.trim() && !matchingTags.includes(inputvalue.trim())) {
      // let the user select what they have typed
      children.unshift(<Option key={inputvalue}>{inputvalue}</Option>)
    }

    return <div>
      <AutoComplete placeholder='Search skills'
        defaultActiveFirstOption // user must select from the dropdown
        onSearch={this.handleSearch}
        onSelect={this.optionSelected}
        value={this.state.inputvalue}
      >
        {children}
      </AutoComplete>
      {this.props.value ? this.props.value.map(tag =>
        <Tag closable
          onClose={() => this.removeTag(tag)}
          key={tag}
        >{tag}</Tag>
      ) : null}
    </div>
  }

  optionSelected = value => {
    const trimmedVal = value.trim().toLowerCase()
    if (trimmedVal && !this.props.value.includes(trimmedVal)) {
      this.props.onChange([...this.props.value, trimmedVal])
    }
    this.setState({ inputvalue: '' })
  }

  handleSearch = value => {
    const val = value.trim()
    const matchingTags = val
      ? this.props.existingTags.filter(tag => tag.toLowerCase().indexOf(val.toLowerCase()) !== -1)
      : []
    this.setState({
      inputvalue: value,
      matchingTags
    })
  }

  removeTag = removedTag => {
    this.props.onChange(this.props.value.filter(tag => tag !== removedTag))
  };
}

OpDetailTagsEditable.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  existingTags: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default OpDetailTagsEditable
