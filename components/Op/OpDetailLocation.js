import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'

const { Option } = Select

class OpDetailLocation extends React.Component {
  state = {
    selectedOption: this.props.value ? this.props.value : null
  };

  handleChange = selectedOption => {
    this.setState({ selectedOption })
    this.props.onChange(selectedOption)
  };

  render () {
    const { selectedOption } = this.state

    return (
      <Select
        showSearch
        placeholder='Select a Region'
        value={selectedOption}
        onChange={this.handleChange}
      >
        <Option value='Auckland' key='Auckland'>Auckland</Option>
        <Option value='Northland' key='Northland'>Northland</Option>
        <Option value='Wellington' key='Wellington'>Wellington</Option>
        <Option value='Southland' key='Southland'>Southland</Option>
        <Option value='Christchurch' key='Christchurch'>Christchurch</Option>
        <Option value='West Coast' key='West Coast'>West Coast</Option>
        <Option value='Wanaka' key='Wanaka'>Wanaka</Option>
      </Select>
    )
  }
}

OpDetailLocation.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
}

export default OpDetailLocation
