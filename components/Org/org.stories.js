import React from 'react'
import { storiesOf } from '@storybook/react'
import OrgCategory from './OrgCategory'
import OrgCard from './OrgCard'
import OrgList from './OrgList'
import OrgSelector from './OrgSelector'
import { StoryIntroContainer } from '../VTheme/VStoryTheme'
import orgs from './__tests__/Org.fixture'
import { withKnobs, number } from '@storybook/addon-knobs'

const groupId = 'GROUP-ID1'

storiesOf('Organisation Components', module)
  .addDecorator(withKnobs)
  .add('OrgCard', () => {
    const value = number('Organisation #', 0, { range: true, min: 0, max: orgs.length - 1, step: 1 }, groupId)

    return (
      <StoryIntroContainer>
        <OrgCard org={orgs[value]} />
        <br /><hr /><br />
        <pre>{JSON.stringify(orgs[value], null, 2)}</pre>
      </StoryIntroContainer>

    )
  })
  .add('OrgList', () => (
    <div>
      <StoryIntroContainer>
        <OrgList orgs={orgs} />
      </StoryIntroContainer>

    </div>
  ))
  .add('OrgCategory', () => (
    <div>
      <StoryIntroContainer>
        <OrgCategory orgCategory={orgs[0].category} />
      </StoryIntroContainer>
    </div>
  ))
  .add('OrgSelector', () => (
    <div>
      <StoryIntroContainer>
        <OrgSelector orgs={orgs} onChange={() => {}} value={{ key: orgs[2]._id }} width='30em' />
      </StoryIntroContainer>
    </div>
  ))
// Note - Cannot do OrgDetail or MemberSection as they require redux connections
