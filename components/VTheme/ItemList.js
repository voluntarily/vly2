import sanitize from 'sanitize-html'
import styled from 'styled-components'
import IdLine from './IdLine'
import { FormattedMessage } from 'react-intl'
/* These are used to create small lists of properties for
  orgs, ops and acts in their details pages
*/

export const Left = styled.div`
  overflow: hidden;
`
export const Right = styled.div``

export const ItemContainer = styled.ul`
  margin: 1.5rem 0 1rem 0;
  padding-left: 0;
  list-style: none;
`
export const ItemListing = styled.li`
  list-style: none;
  font-weight: 500;
  font-size: 1rem;
  opacity: 1;
  color: initial;
  margin-bottom: 0.3rem;
`
export const ItemDescription = styled.article`
  letter-spacing: -0.02rem;
  font-weight: 400;
  font-size: 1rem;
  opacity: 1;
  color: initial;
  margin-bottom: 1rem;
  `

export const TagContainer = styled.div`
  margin-top: 0.2rem;
`
export const ItemDuration = ({ duration }) =>
  <ItemListing>
  ⏱&nbsp;
    <strong>
      <FormattedMessage
        id='itemlist.duration'
        defaultMessage='Duration:'
        description='duration label for acts and ops'
      />
    </strong>&nbsp;&nbsp;&nbsp;
    {sanitize(duration)}
  </ItemListing>

export const ItemStatus = ({ status }) =>
  <ItemListing>
    📝&nbsp;
    <strong>
      <FormattedMessage
        id='itemlist.status'
        defaultMessage='Status:'
        description='Status label for acts and ops'
      />
    </strong>&nbsp;&nbsp;&nbsp;
    {sanitize(status)}
  </ItemListing>

export const EquipmentList = ({ equipment }) =>
  <ItemListing>
    <FormattedMessage
      id='itemlist.equipment'
      defaultMessage='Equipment:'
      description='Equipment label for acts and ops'
    />&nbsp;&nbsp;&nbsp;
    <ul>
      {equipment.map(item => <li>{item}</li>)}
    </ul>
  </ItemListing>

export const ItemIdLine = ({ item, path }) =>
  <ItemListing>
    <IdLine item={item} path={path} />
  </ItemListing>

export const ItemDate = ({ startDate, endDate }) =>
  <ItemListing>
    🗓&nbsp;
    <strong>
      <FormattedMessage
        id='itemlist.date'
        defaultMessage='Date:'
        description='Date label for acts and ops'
      />
    </strong>&nbsp;&nbsp;&nbsp;
    {startDate}{' '}{endDate}
  </ItemListing>

export const ItemLocation = ({ location }) =>
  location
    ? <ItemListing>
    🏫&nbsp;
      <strong>
        <FormattedMessage
          id='itemlist.location'
          defaultMessage='Location:'
          description='Location label for acts and ops'
        />
      </strong>&nbsp;&nbsp;&nbsp;
      {sanitize(location)}
    </ItemListing>
    : ''

export const ItemVolunteers = ({ volunteers }) => {
  if (!volunteers) return ''

  if (volunteers >= 1) {
    return (
      <ItemListing>
        🙋&nbsp;
        <strong>
          <FormattedMessage
            id='act.detail.volunteersrequired'
            defaultMessage='Volunteers:'
            description='label for number of volunteers required'
          />
        </strong>
        &nbsp;&nbsp;&nbsp;{volunteers}
      </ItemListing>
    )
  } else if (volunteers < 1) {
    return (
      <ItemListing>
        🙋&nbsp;
        <strong>
          <FormattedMessage
            id='act.detail.volunteerratio'
            defaultMessage='Volunteers per student:'
            description='label for number of volunteers required per student'
          />
        </strong>
        &nbsp;&nbsp;&nbsp;{Math.round(1 / volunteers)}
      </ItemListing>
    )
  }

  return ''
}

export const ItemSpace = ({ space }) =>
  space
    ? <ItemListing>
    🐘&nbsp;
      <strong>
        <FormattedMessage
          id='act.detail.space'
          defaultMessage='Space:'
          description='label for space requirement'
        />
      </strong>&nbsp;&nbsp;&nbsp;{space}
    </ItemListing>
    : ''
