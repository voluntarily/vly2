import { Icon } from 'antd'
import styled from 'styled-components'
import { Category } from '../../server/api/organisation/organisation.constants'

const HorUl = styled.ul`
  margin:0;
  padding:0;

  li {
    display: inline;
    padding-right: 1em;
  }
`

const OrgCategoryItem = ({ orgCategoryItem }) => {
  const categoryOptions = [
    { label: <Icon type='bank' />, value: Category.BUSINESS },
    { label: <Icon type='read' />, value: Category.SCHOOL },
    { label: <Icon type='thunderbolt' />, value: Category.ACTIVITYPROVIDER },
    { label: <Icon type='team' />, value: Category.AGENCY },
    { label: <Icon type='question-circle' />, value: Category.OTHER }
  ]
  const item = categoryOptions
    .filter(category => category.value === orgCategoryItem)[0].label
  return (
    <li>{item}</li>
  )
}

const OrgCategory = ({ orgCategory }) =>
  <HorUl>
    {orgCategory.map((t, index) => <OrgCategoryItem key={index} orgCategoryItem={t} />)}
  </HorUl>

export default OrgCategory
