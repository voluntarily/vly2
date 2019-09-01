import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'

const { Option } = Select

class OrgSelector extends React.Component {
  render () {
    const { orgs, onChange, value } = this.props
    const children = orgs && orgs.map(org => <Option key={org._id} value={org._id}>{org.name}</Option>)
    return (
      <Select
        labelInValue
        onChange={onChange}
        value={value}
      >
        {children}
      </Select>
    )
  }
}

OrgSelector.propTypes = {
  value: PropTypes.shape({
    key: PropTypes.string,
    label: PropTypes.string
  }),
  onChange: PropTypes.func,
  orgs: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default OrgSelector
