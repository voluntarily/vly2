// TODO translate - could just translate message val.
const OrgCategoryItem = ({ orgCategoryItem }) => {
  const categoryOptions = [
    { label: 'Business', value: 'vp' },
    { label: 'School', value: 'op' },
    { label: 'Activity provider', value: 'ap' },
    { label: 'Agency', value: 'admin' },
    { label: 'Other', value: 'other' }
  ]
  const item = categoryOptions
    .filter(category => category.value === orgCategoryItem)
    .reduce((category) => category.label)

  return (
    <li> {item.label}</li>
  )
}

const OrgCategory = ({ orgCategory }) => <ul>{orgCategory.map((t, index) => <OrgCategoryItem key={index} orgCategoryItem={t} />)}</ul>

export default OrgCategory
