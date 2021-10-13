import { AutoComplete } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { TagStyle } from '../../VTheme/VTheme'
const { Option } = AutoComplete

class TagInput extends React.Component {
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

      return (
        <>
          <AutoComplete
            defaultActiveFirstOption // user must select from the dropdown
            onSearch={this.handleSearch}
            onSelect={this.handleSelect}
            value={this.state.inputvalue}
          >
            {children}
          </AutoComplete>
          {this.props.value
            ? this.props.value.map(tag =>
              <TagStyle
                closable
                onClose={() => this.removeTag(tag)}
                key={tag}
              >{tag}
              </TagStyle>
              )
            : null}
        </>
      )
    }

    handleSelect = value => {
      const trimmedVal = value.trim().toLowerCase()
      if (trimmedVal && !this.props.value.includes(trimmedVal)) {
        this.props.onChange([...this.props.value, trimmedVal])
      }
      this.setState({ inputvalue: '', matchingTags: [] })
    }

    handleSearch = value => {
      const val = value.trim()
      if (val && val.endsWith(',')) {
        const trimmedVal = val.slice(0, -1)
        this.handleSelect(trimmedVal)
      } else {
        const matchingTags = (val && this.props.existingTags)
          ? this.props.existingTags
              .filter(tag => tag.toLowerCase().indexOf(val.toLowerCase()) !== -1 && !this.props.value.includes(tag.toLowerCase()))
          : []
        this.setState({
          inputvalue: value,
          matchingTags
        })
      }
    }

    removeTag = removedTag => {
      this.props.onChange(this.props.value.filter(tag => tag !== removedTag))
    };
}

TagInput.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  existingTags: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default TagInput
