import { Select } from 'antd'

const OrgSelector = ({ orgs, onChange, value, className }) => {
  if (!orgs || orgs.length === 0) { return '' }
  const options = orgs.map(
    org => ({ label: org.name, value: org._id })
  )

  // we are passed an org but need to reshape it to a key value pair
  if (value?.name) value = ({ label: value.name, value: value._id })
  return (
    <Select
      labelInValue
      onChange={onChange}
      options={options}
      value={value}
      className={className}
      aria-label='choose an organisation you want to run this activity for'
    />
  )
}

export default OrgSelector
