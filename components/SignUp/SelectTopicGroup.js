import { HalfGrid } from '../VTheme/VTheme'
import { OpTypeTopicGroup } from '../Op/OpType'
import { ToggleUl, ToggleLi } from './SignUpStyles'
import { FormattedMessage, defineMessages } from 'react-intl'
import { OpportunityType } from '../../server/api/opportunity/opportunity.constants'
const { ASK, OFFER } = OpportunityType

export const topicGroupMessages = {
  business: defineMessages({
    [ASK]: { id: 'SelectTopicGroup.business.ASK', defaultMessage: 'Get help from experts in other businesses  ' },
    [OFFER]: { id: 'SelectTopicGroup.business.OFFER', defaultMessage: 'Help small businesses with technical and HR issues' }
  }),
  community: defineMessages({
    [ASK]: { id: 'SelectTopicGroup.community.ASK', defaultMessage: 'Volunteers in your community want to help you' },
    [OFFER]: { id: 'SelectTopicGroup.community.OFFER', defaultMessage: 'Offer your skills and time to your community' }
  }),
  education: defineMessages({
    [ASK]: { id: 'SelectTopicGroup.education.ASK', defaultMessage: 'Skilled volunteers are on standby to help you' },
    [OFFER]: { id: 'SelectTopicGroup.education.OFFER', defaultMessage: 'Offer your skills and time to students and teachers' }
  })
}

/**
 * This page asks the person to select whether they are an asker or offerer
 */
export const SelectTopicGroupButtons = ({ type, topicGroups, onChange }) =>
  <>
    <h1>
      <OpTypeTopicGroup type={type} />
    </h1>
    <ToggleUl id='topicGroup_options'>
      <ToggleLi key='group_business' icon='business' checked={topicGroups.business} onChange={(on) => onChange({ business: on })}>
        <div>
          <h2>
            <FormattedMessage
              id='SelectTopicGroup.title.business'
              defaultMessage='Small Businesses'
            />
          </h2>
          <p>
            <FormattedMessage {...topicGroupMessages.business[type]} />
          </p>
        </div>
      </ToggleLi>
      <ToggleLi key='group_community' icon='community' checked={topicGroups.community} onChange={(on) => onChange({ community: on })}>
        <div>
          <h2>
            <FormattedMessage
              id='SelectTopicGroup.title.community'
              defaultMessage='Communities'
            />
          </h2>
          <p>
            <FormattedMessage {...topicGroupMessages.community[type]} />
          </p>
        </div>
      </ToggleLi>
      <ToggleLi key='group_education' icon='school' checked={topicGroups.education} onChange={(on) => onChange({ education: on })}>
        <div>
          <h2>
            <FormattedMessage
              id='SelectTopicGroup.title.education'
              defaultMessage='Schools'
            />
          </h2>
          <p>
            <FormattedMessage {...topicGroupMessages.education[type]} />

          </p>
        </div>
      </ToggleLi>
    </ToggleUl>
  </>

/**
 * This page asks the person to select whether they are an asker or offerer
 */
export const SelectTopicGroup = (props) =>
  <HalfGrid style={{ paddingTop: 0 }}>
    <div id='leftCol'>
      <img style={{ width: '100%' }} src='/static/img/sign-up/topic.svg' />
    </div>
    <div id='rightCol'>
      <SelectTopicGroupButtons {...props} />
      {props.children}
    </div>
  </HalfGrid>
export default SelectTopicGroup
