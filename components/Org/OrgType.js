// TODO translate - could just translate message val.
const OrgType = ({ orgType }) => {
  const typeOptions = [
    { label: 'Business', value: 'vp' },
    { label: 'School', value: 'op' },
    { label: 'Activity provider', value: 'ap' },
    { label: 'Agency', value: 'admin' },
    { label: 'Other', value: 'other' }
  ]
  const item = typeOptions
    .filter(t => t.value === orgType)
    .reduce((a, t) => t.label)

  return (
    <li> {item ? item.label : 'unknown'}</li>
  )
}

export default OrgType
