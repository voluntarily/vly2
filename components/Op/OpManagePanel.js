/* Dumb React component Shows contents of an opportunity
 */
import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import InterestSection from '../../components/Interest/InterestSection'
import OpCloseOpportunity from '../../components/Op/OpCloseOpportunity'
import { ProfilePanel, ProfileSection } from '../VTheme/Profile'

export function OpManagePanel ({
  op
}) {
  return (
    <ProfilePanel>
      <ProfileSection>
        <h2>
          <FormattedMessage
            id='interestSection.name'
            defaultMessage='Interested Volunteers'
            description='label for interest table on op detail page'
          />
        </h2>
        <InterestSection opid={op._id} />
      </ProfileSection>
      <ProfileSection>
        <OpCloseOpportunity op={op} />
      </ProfileSection>
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
