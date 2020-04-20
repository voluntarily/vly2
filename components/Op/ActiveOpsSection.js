/* Display a grid of goal cards from an personal goals
 */
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { ProfileSection, ProfileSectionTitle } from '../VTheme/Profile'
import Loading from '../Loading'
import OpList from './OpList'
import { Divider } from 'antd'

/* ActiveOpsSection
  shows the list of opportunities currently in draft and active mode
  and owned by the current person.
  it expects to find a populated list of opportunities
  in the redux store, placed there by the parent page
  */

export const ActiveOpsSection = () => {
  const opportunities = useSelector(
    state => state.opportunities // list of ops I own
  )
  if (!opportunities.sync) return <Loading label='opportunities' entity={opportunities} />
  const ops = opportunities.data
  if (!ops.length) return null
  return (
    <>
      <ProfileSection>
        <ProfileSectionTitle>
          <FormattedMessage
            id='ActiveOpsSection.title'
            defaultMessage='You are asking for'
            description='Subtitle for home page for active opportunities that have been hosted'
          />
          <small>
            <FormattedMessage
              id='ActiveOpsSection.prompt'
              defaultMessage='Activities you requested help from Volunteers with are listed below:'
              description='prompt for home page for active opportunities that have been hosted'
            />
          </small>
        </ProfileSectionTitle>
        <OpList ops={ops} />
      </ProfileSection>
      <Divider />
    </>
  )
}

export default ActiveOpsSection
