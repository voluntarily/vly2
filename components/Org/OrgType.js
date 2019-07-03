// TODO translate - could just translate message val.
const OrgTypeItem = ({ orgTypeItem }) => {
  const typeOptions = [
    { label: 'Business', value: 'vp' },
    { label: 'School', value: 'op' },
    { label: 'Activity provider', value: 'ap' },
    { label: 'Agency', value: 'admin' },
    { label: 'Other', value: 'other' }
  ]
  const item = typeOptions
    .filter(t => t.value === orgTypeItem)
    .reduce((a, t) => t.label)

  return (
    <li> {item ? item.label : 'unknown'}</li>
  )
}

const OrgType = ({ orgType }) => <ul>{orgType.map((t, index) => <OrgTypeItem key={index} orgTypeItem={t} />)}</ul>

export default OrgType
