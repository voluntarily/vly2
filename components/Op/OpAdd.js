/*
  New Opportunity Button
*/
import { Button } from 'antd'
import Link from 'next/link'
import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { Role } from '../../server/services/authorize/role'
import { OpportunityType } from '../../server/api/opportunity/opportunity.constants'

import styled from 'styled-components'

const OppAddButtons = styled.div`
    display: flex;

    Button:nth-child(1) {
      margin-right: 1rem;
    }
`

export const OpAddNewBtn = () => {
  const href = '/acts'

  return (
    <Link href={href}>
      <Button type='primary' block shape='round' size='large'>
        <FormattedMessage
          id='OpAdd.newAskOffer'
          defaultMessage='New request or offering'
          description='Button to create a new Ask or Offer opportunity used on multiple pages'
        />
      </Button>
    </Link>)
}

export const OpAddAskBtn = ({ actid }) => {
  let href = `/op/${OpportunityType.ASK}`
  if (actid) {
    href = href.concat(`?act=${actid}`)
  }
  return (
    <Link href={href}>
      <Button type='primary' block shape='round' size='large'>
        <FormattedMessage
          id='OpAdd.newAsk'
          defaultMessage='Ask for help with this'
          description='Button to create a new Ask opportunity used on multiple pages'
        />
      </Button>
    </Link>)
}

export const OpAddOfferBtn = ({ actid }) => {
  let href = `/op/${OpportunityType.OFFER}`
  if (actid) {
    href = href.concat(`?act=${actid}`)
  }
  return (
    <Link href={href}>
      <Button type='primary' block shape='round' size='large'>
        <FormattedMessage
          id='OpAdd.newOffer'
          defaultMessage='Offer to help with this'
          description='Button to create a new offer opportunity used on multiple pages'
        />
      </Button>
    </Link>)
}

const OpAdd = ({ roles, actid }) => {
  if (!roles.length || !roles.includes(Role.OPPORTUNITY_PROVIDER)) return null
  return (
    <OppAddButtons>
      <><OpAddAskBtn actid={actid} />&nbsp;</>
      {(roles.includes(Role.VOLUNTEER)) && <OpAddOfferBtn actid={actid} />}
    </OppAddButtons>
  )
}

OpAdd.propTypes = {
  roles: PropTypes.array.isRequired
}

// Warning me will be {} if not signed in and role will be undefined.
const mapStateToProps = store => ({
  roles: store.session.me.role || []
})

export default connect(
  mapStateToProps
)(OpAdd)
