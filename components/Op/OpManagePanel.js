/* Dumb React component Shows contents of an opportunity
 */
import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import InterestSection from '../../components/Interest/InterestSection'
import InterestArchivedSection from '../../components/Interest/InterestArchivedSection'
import OpCloseOpportunity from '../../components/Op/OpCloseOpportunity'
import { ProfilePanel, ProfileSection } from '../VTheme/Profile'
import { OpportunityStatus, OpportunityType } from '../../server/api/opportunity/opportunity.constants'

export function OpManagePanel ({ op }) {
  const isDone = [OpportunityStatus.COMPLETED, OpportunityStatus.CANCELLED].includes(op.status)
  return (
    <ProfilePanel>
      <ProfileSection>
        <h2>
          {op.type === OpportunityType.OFFER
            ? (
              <FormattedMessage
                id='interestSection.offer.name'
                defaultMessage='People asking for help'
                description='label for interest table on op detail page'
              />
              )
            : (
              <FormattedMessage
                id='interestSection.ask.name'
                defaultMessage='People offering to help'
                description='label for interest table on op detail page'
              />)}

        </h2>
        {isDone
          ? <InterestArchivedSection opid={op._id} />
          : <InterestSection opid={op._id} />}
      </ProfileSection>
      {!isDone && (
        <ProfileSection>
          <OpCloseOpportunity op={op} />
        </ProfileSection>)}
    </ProfilePanel>
  )
}

OpManagePanel.propTypes = {
  op: PropTypes.shape({
    name: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.any,
    description: PropTypes.string,
    duration: PropTypes.string,
    status: PropTypes.string
  })
}

export default OpManagePanel
