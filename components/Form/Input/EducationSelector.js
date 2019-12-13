import { Select } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import fetch from 'isomorphic-fetch'

const { Option } = Select

const EducationSelector = ({ onChange, value, width }) => {
  const [educationLevels, setEducationLevels] = useState([])
  if (!educationLevels) return 'There should be some education levels'
  const children = educationLevels.map(education => <Option key={education}>{education}</Option>)
  return (
    <Select
      showSearch
      placeholder='Select your education'
      onChange={onChange}
      value={value}
      style={width && { width: width }}
    >
      {children}
    </Select>
  )
}

EducationSelector.GetInitialProps = async () => {
  const ed = await fetch('/api/education')
  // setEducationLevels(ed)
  console.log(ed)
}


EducationSelector.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  educationLevels: PropTypes.arrayOf(PropTypes.string).isRequired,
  width: PropTypes.string
}

export default EducationSelector
