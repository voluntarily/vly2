/* Display a grid of organisation cards from an [org]
 */
import React from 'react'
import PropTypes from 'prop-types'
import OrgCard from './OrgCard'
import { Grid } from '../VTheme/VTheme'
import { OrganisationRole } from '../../server/api/organisation/organisation.constants'

const OrgList = ({ orgs, ...props }) => (
  <Grid>
    {orgs
      ? orgs.map((org, index) => <OrgCard org={org} key={index} />)
      : 'No Matching Organisations'}
  </Grid>
)

OrgList.propTypes = {
  orgs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      imgUrl: PropTypes.string,
      role: PropTypes.arrayOf(
        PropTypes.oneOf([OrganisationRole.ADMIN, OrganisationRole.OPPORTUNITY_PROVIDER, OrganisationRole.VOLUNTEER_PROVIDER, OrganisationRole.ACTIVITY_PROVIDER, 'other'])
      ).isRequired,
      _id: PropTypes.string.isRequired
    })
  ) // optional as may update later.
}

export default OrgList
