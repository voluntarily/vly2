/*
  New Opportunity Button
*/
import { Button } from 'antd'
import Link from 'next/link'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Role } from '../../server/services/authorize/role'
import { OpportunityType } from '../../server/api/opportunity/opportunity.constants'
import { SignUpInviteModal } from '../SignUp/SignUpInviteModal'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

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
      <Button type='primary' shape='round' size='large'>
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
    <SignUpInviteModal href={href}>
      <FormattedMessage
        id='OpAdd.newAsk'
        defaultMessage='Ask for help'
        description='Button to create a new Ask opportunity used on multiple pages'
      />
    </SignUpInviteModal>
  )
}

export const OpAddOfferBtn = ({ actid }) => {
  let href = `/op/${OpportunityType.OFFER}`
  if (actid) {
    href = href.concat(`?act=${actid}`)
  }
  return (
    <SignUpInviteModal href={href}>
      <FormattedMessage
        id='OpAdd.newOffer'
        defaultMessage='Offer to help'
        description='Button to create a new offer opportunity used on multiple pages'
      />
    </SignUpInviteModal>)
}

export const OpAdd = ({ actid }) => {
  const roles = useSelector(state => state.session.me.role || [])
  console.log(`actid ${actid}`)
  if (!roles.length || !roles.includes(Role.OPPORTUNITY_PROVIDER)) return null
  return (
    <OppAddButtons>
      <><OpAddAskBtn actid={actid} />&nbsp;</>
      {(roles.includes(Role.VOLUNTEER)) && <OpAddOfferBtn actid={actid} />}
    </OppAddButtons>
  )
}

export default OpAdd
