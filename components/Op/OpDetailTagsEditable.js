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
    if (inputvalue && !matchingTags.includes(inputvalue)) {
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
    if (value && !this.props.value.includes(value)) {
      this.props.onChange([...this.props.value, value])
      this.setState({ inputvalue: '' })
    }
  }

  handleSearch = value => {
    const matchingTags = value
      ? this.props.existingTags.filter(tag => tag.toUpperCase().indexOf(value.toUpperCase()) !== -1)
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
