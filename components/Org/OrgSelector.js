import { Select } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

const { Option } = Select

const OrgSelector = ({ orgs, onChange, value, className }) => {
  if (!orgs || orgs.length === 0) { return '' }
  return (
    <Select
      labelInValue
      onChange={onChange}
      value={value}
      className={className}
    >
      {orgs.map(
        org =>
          <Option key={org._id}>
            {org.name}
          </Option>)}
    </Select>
  )
}

OrgSelector.propTypes = {
  value: PropTypes.shape({
    key: PropTypes.string,
    label: PropTypes.string
  }),
  onChange: PropTypes.func,
  orgs: PropTypes.arrayOf(PropTypes.object).isRequired,
  className: PropTypes.string
}

export default OrgSelector
