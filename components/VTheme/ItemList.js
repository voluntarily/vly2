import sanitize from 'sanitize-html'
import styled from 'styled-components'
import IdLine from './IdLine'
import { Divider } from 'antd'
import { FormattedMessage } from 'react-intl'
import { StreetAddressLinkLi } from '../Address/StreetAddress'
import { displayDuration } from '../../lib/durationUtil'
/* These are used to create small lists of properties for
  orgs, ops and acts in their details pages
*/

export const Left = styled.div`
  overflow: hidden;
`
export const Right = styled.div`
ul {
  padding-left: 0;
}
`

export const ItemContainer = styled.ul`
  margin: 1.5rem 0 1rem 0;
  padding-left: 0;
  list-style: none;
`
export const ItemListing = styled.ul`
  list-style: none;
  font-weight: 500;
  font-size: 1rem;
  opacity: 1;
  color: initial;
  margin-bottom: 0.3rem;
  padding-left: 0;
`
export const ItemDescription = styled.div`
  letter-spacing: -0.02rem;
  font-weight: 400;
  font-size: 1rem;
  opacity: 1;
  color: initial;
  margin-bottom: 1rem;
  text-align: left;

  ul {
    padding-left: 0;
  }
`

export const TagContainer = styled.div`
  margin-top: 0.2rem;
`

export const ItemImage = styled.img`
width: 100%;
height: 20rem;
object-fit: cover;
object-position: center;
`

export const ItemDuration = ({ duration }) => {
  const durationString = displayDuration(sanitize(duration))

  return (
    <ItemListing>
      ⏱&nbsp;
      <strong>
        <FormattedMessage
          id='itemlist.duration'
          defaultMessage='Duration:'
          description='duration label for acts and ops'
        />
      </strong>{' '}
      {durationString}
    </ItemListing>
  )
}

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

const EquipmentListItem = styled.li`
margin: 0.5rem 0 1.5rem 0;
font-size: 1.1rem;
`

export const EquipmentList = ({ equipment }) =>
  equipment && equipment.length
    ? (
      <div>
        <Divider />
        <h5><strong>
          <FormattedMessage
            id='itemlist.equipment'
            defaultMessage='Equipment needed:'
            description='Equipment label for acts and ops'
          /></strong>
        </h5>
        <ul>
          {equipment.map((item, index) => <EquipmentListItem key={index}>{item}</EquipmentListItem>)}
        </ul>
      </div>)
    : ''

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

const LocationUl = styled.ul`
  padding: 0;
  display: inline-block;
  li {
    list-style: none;
    display: inline-block;
    padding-right: 0.4rem;
    ::after { 
      content: ','
    }
    :last-child {
      ::after { 
        content: ''
      }
    }
  }
`

export const LocationsList = ({ locations }) =>
  (locations && locations.length
    ? (
      <ItemListing>
        📍&nbsp;
        <strong>
          <FormattedMessage
            id='itemlist.locations'
            defaultMessage='Locations:'
            description='Location label for acts and ops'
          />
        </strong>&nbsp;&nbsp;&nbsp;
        <LocationUl>
          {locations.map(
            (loc, index) => <li key={index}>{loc}</li>
          )}
        </LocationUl>
      </ItemListing>
      )
    : '')

export const ItemVenue = ({ venue }) =>
  <ItemListing>
    🏫&nbsp;
    <strong>
      <FormattedMessage
        id='itemlist.venue'
        defaultMessage='Venue:'
        description='Venue label for acts and ops'
      />
    </strong>&nbsp;&nbsp;&nbsp;
    <StreetAddressLinkLi address={sanitize(venue)} />
  </ItemListing>

export const ItemResource = ({ resource }) =>
  <ItemListing>
    🛠️&nbsp;
    <strong>
      <FormattedMessage
        id='itemlist.resource'
        defaultMessage='General:'
        description='Resource label for acts and ops'
      />
    </strong>&nbsp;&nbsp;&nbsp;
    {resource && sanitize(resource)}
  </ItemListing>

export const ItemNeeds = ({ volunteers, equipment }) => {
  if (!volunteers) return ''
  if (volunteers >= 1) {
    return (
      <ItemListing>
        <strong>
          <FormattedMessage
            id='ItemNeeds.required'
            defaultMessage='🤔 Activity needs:'
            description='label for number of people required'
          />
        </strong>
        <FormattedMessage
          id='ItemNeeds.volunteers'
          defaultMessage=' {volunteers, number} {volunteers, plural, one {person} other {people}}'
          description='label for number of people required'
          values={{
            volunteers
          }}
        />
        {equipment && equipment.length &&
          <FormattedMessage
            id='ItemNeeds.items'
            defaultMessage=', {count, number} {count, plural, one {item} other {items} }'
            description='label for number of volunteers required'
            values={{ count: equipment.length }}
          />}
      </ItemListing>
    )
  }

  return (
    <ItemListing>
      <strong>
        <FormattedMessage
          id='ItemList.volunteerratio'
          defaultMessage='🙋One volunteer for each {ratio, number} people'
          description='label for number of volunteers required per student'
          values={{ ratio: Math.round(1 / volunteers) }}
        />
      </strong>
    </ItemListing>
  )
}

export const ItemSpace = ({ space }) =>
  space
    ? (
      <ItemListing>
        🐘&nbsp;
        <strong>
          <FormattedMessage
            id='ItemList.space'
            defaultMessage='Space:'
            description='label for space requirement'
          />
        </strong>&nbsp;&nbsp;&nbsp;{space}
      </ItemListing>
      )
    : ''
