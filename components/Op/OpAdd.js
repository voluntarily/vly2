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

export const OpAddAskBtn = () => {
  const href = `/op/${OpportunityType.ASK}`
  return (
    <Link href={href}>
      <Button type='primary' block shape='round' size='large'>
        <FormattedMessage
          id='opAdd.newAsk'
          defaultMessage='New Request'
          description='Button to create a new Ask opportunity used on multiple pages'
        />
      </Button>
    </Link>)
}

export const OpAddOfferBtn = () => {
  const href = `/op/${OpportunityType.OFFER}`
  return (
    <Link href={href}>
      <Button type='primary' block shape='round' size='large'>
        <FormattedMessage
          id='opAdd.newOffer'
          defaultMessage='New Offer'
          description='Button to create a new offer opportunity used on multiple pages'
        />
      </Button>
    </Link>)
}

const OpAdd = ({ roles }) => {
  if (!roles.length) return null
  return (
    <OppAddButtons>
      {(roles.includes(Role.OPPORTUNITY_PROVIDER)) && <><OpAddAskBtn /> &nbsp; </>}
      {(roles.includes(Role.VOLUNTEER_PROVIDER)) && <OpAddOfferBtn />}
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
