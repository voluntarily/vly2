import { Icon } from 'antd'
import styled from 'styled-components'

const HorUl = styled.ul`
  background-color: yellow;
  margin:0;
  padding:0;

  li {
    display: inline;
    padding-right: 1em;
  }
`

// TODO translate - could just translate message val.
const OrgCategoryItem = ({ orgCategoryItem }) => {
  const categoryOptions = [
    { label: <Icon type='read' />, value: 'vp' },
    { label: <Icon type='book' />, value: 'op' },
    { label: <Icon type='thunderbolt' />, value: 'ap' },
    { label: <Icon type='team' />, value: 'admin' },
    { label: <Icon type='question-circle' />, value: 'other' }
  ]
  const item = categoryOptions
    .filter(category => category.value === orgCategoryItem)
    .reduce(category => category.label)

  return (
    <li>{item.label}</li>
  )
}

const OrgCategory = ({ orgCategory }) => <HorUl>{orgCategory.map((t, index) => <OrgCategoryItem key={index} orgCategoryItem={t} />)}</HorUl>

export default OrgCategory
