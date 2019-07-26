// TODO translate - could just translate message val.
const OrgCategoryItem = ({ orgCategoryItem }) => {
  const typeOptions = [
    { label: 'Business', value: 'vp' },
    { label: 'School', value: 'op' },
    { label: 'Activity provider', value: 'ap' },
    { label: 'Agency', value: 'admin' },
    { label: 'Other', value: 'other' }
  ]
  const item = typeOptions
    .filter(t => t.value === orgCategoryItem)
    .reduce((a, t) => t.label)

  return (
    <li> {item ? item.label : 'unknown'}</li>
  )
}

const OrgCategory = ({ orgCategory }) => <ul>{orgCategory.map((t, index) => <OrgCategoryItem key={index} orgCategoryItem={t} />)}</ul>

export default OrgCategory
