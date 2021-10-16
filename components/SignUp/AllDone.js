import { FormattedMessage } from 'react-intl'
import { HalfGrid } from '../VTheme/VTheme'
import { Avatar } from 'antd'
import styled from 'styled-components'
import { OpTypeTopicVerb } from '../Op/OpType'
const Panel = styled.div`
  padding: 1rem;
  margin: 0 0 1.5rem 0;
  // box-shadow: 2px 2px 12px 0 rgba(190, 190, 190, 0.5);
  // border-radius: 8px;
  display: grid;
  grid-template-columns: 4rem 1fr;
  gap: 1rem;  
  // width: 30rem;
  
  strong {
    font-size: 1.2rem;
    font-weight: 600;
  }
  ul {
  display: inline-block;
  position: relative;
  width: auto;
  margin:0;
  padding: 0;
  }
  li {
    display: inline-block;
    list-style: none;
    padding-right: 1rem;
  }
`

const PersonSummary = ({ person }) =>
  <Panel>
    <div>
      <Avatar shape='circle' size={64} src={person.imgUrlSm} style={{ marginRight: '2rem' }} />
    </div>
    <div>
      <p><strong>{person.nickname}</strong></p>
      <ul>{person.locations.map(loc => <li key={loc}>{loc}</li>)}</ul>
    </div>
  </Panel>

const TopicSummary = ({ type, topicGroups }) =>
  <Panel>
    <div>
      <img alt='ask for help icon' style={{ width: '100%' }} src='/static/img/sign-up/ask.svg' />
    </div>
    <div>
      <p><strong><OpTypeTopicVerb type={type} /></strong></p>
      <ul>{topicGroups.map(grp => <li key={grp}>{grp}</li>)}</ul>
    </div>
  </Panel>

export const AllDone = ({ children, type, topicGroups, person }) =>
  <HalfGrid>
    <div>
      <img alt='all done icon' src='/static/img/sign-up/alldone.svg' />
    </div>
    <div>
      <h1>
        <FormattedMessage
          id='AllDone.title'
          defaultMessage='You are ready to go'
        />
      </h1>
      <PersonSummary person={person} />
      <TopicSummary type={type} topicGroups={Object.keys(topicGroups).filter(key => topicGroups[key])} />
      {children}
    </div>
  </HalfGrid>
export default AllDone
