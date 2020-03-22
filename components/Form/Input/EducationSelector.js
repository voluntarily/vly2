import { Select } from 'antd'
import { useState, useEffect } from 'react'
import callApi from '../../../lib/callApi'

const { Option } = Select

export const EducationSelector = ({ onChange, value }, ref) => {
  const [educationOptions, seteducationOptions] = useState('')

  useEffect(() => {
    const getEducationOptions = async () => {
      const edLevels = await callApi('education')
      seteducationOptions(edLevels.map(education => <Option value={education} key={education}>{education}</Option>))
    }
    getEducationOptions()
  }, [])

  // console.log('EducationSelector', educationOptions)
  return (
    <Select
      showSearch
      placeholder='Select your education'
      onChange={onChange}
      value={value}
      style={{ width: '100%' }}
      // style={width && { width: width }}
    >
      {educationOptions}
    </Select>
  )
}

// EducationSelector.propTypes = {
//   value: PropTypes.string,
//   onChange: PropTypes.func,
//   width: PropTypes.string
// }

export default EducationSelector
