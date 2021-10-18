import { FormattedMessage } from 'react-intl'
import React from 'react'

const orgTab = (
  <FormattedMessage
    id='orgTabs.about'
    defaultMessage='About'
    description='Tab label on OrgDetailsPage'
  />
)

const orgMemberTab = (
  <FormattedMessage
    id='orgMembers'
    defaultMessage='Members'
    description='show opportunities list on volunteer home page'
  />
)

const orgInstructionTab = (
  <FormattedMessage
    id='orgInstructions'
    defaultMessage='Getting Started'
    description='show opportunities list on volunteer home page'
  />
)

const orgOffersTab = (
  <FormattedMessage
    id='orgOffers'
    defaultMessage='Offers'
    description='show opportunities list on volunteer home page'
  />
)

const orgEditTab = (
  <FormattedMessage
    id='orgTabs.edit'
    defaultMessage='Edit'
    description='Tab label for org Editor panel on organisation page'
  />
)

const orgHistoryTab = (
  <FormattedMessage
    id='orgTabs.history'
    defaultMessage='History'
    description='Tab label for org history panel on organisation page'
  />
)

export {
  orgTab,
  orgMemberTab,
  orgInstructionTab,
  orgOffersTab,
  orgEditTab,
  orgHistoryTab
}
