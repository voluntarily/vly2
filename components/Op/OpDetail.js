/* Dumb React component Shows contents of an opportunity
 */
import { FormattedMessage } from 'react-intl'
import { Button, Divider, Tabs, Icon } from 'antd'
import Markdown from 'markdown-to-jsx'
import styled from 'styled-components'
import moment from 'moment'
import Head from 'next/head'
import PropTypes from 'prop-types'
import React from 'react'
import TagDisplay from '../Tags/TagDisplay'
import { HalfGrid, Spacer } from '../VTheme/VTheme'
import {
  Left,
  Right,
  ItemContainer,
  ItemDescription,
  TagContainer,
  ItemDuration,
  ItemStatus,
  ItemIdLine,
  ItemDate,
  ItemImage
} from '../VTheme/ItemList'

const { TabPane } = Tabs


const aboutTab = (
  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
    <Icon type='info-circle' />
    <FormattedMessage id='orgAbout' />
  </span>
)

const questionTab = (
  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
    <Icon type='question' />
    Questions
  </span>
)

const manageTab = (
  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
    <Icon type='info-circle' />
    Manage Volunteers
  </span>
)

const editTab = (
  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
    <Icon type='setting' />
    Edit Activity
  </span>
)

const AboutGrid = styled.div`
margin-top: 4rem;
display: grid;
grid-template-columns: 25rem 1fr;
gap: 5rem;
text-align: left;

`




export function OpDetail ({ op }) {
  // This will make sure that if the description is undefined we will set it to an empty string
  // Otherwise Markdown will throw error
  const description = op.description || ''
  const startDate = op.date[0]
    ? moment(op.date[0]).format('h:mmA · ddd DD/MM/YY')
    : 'Negotiable'
  const endDate = op.date[1]
    ? '  →  ' + moment(op.date[1]).format('h:mmA · ddd DD/MM/YYYY')
    : ' '
  const img = op.imgUrl || '.././static/missingimage.svg'
  const shadowStyle = { overflow: 'visible', textAlign: 'center' }
  return (
    <>
      <Head>
        <title>Voluntarily - {op.name}</title>
      </Head>
      <HalfGrid>
        <Left>
          <ItemImage src={img} alt={op.name} />
          <TagContainer>
            <TagDisplay tags={op.tags} />
          </TagContainer>
        </Left>
        <Right>
          <h1>{op.name}</h1>
          <h3>{op.location}</h3>
          <ItemContainer>
            <ItemDuration duration={op.duration} />
            <ItemDate startDate={startDate} endDate={endDate} />
            <ItemStatus status={op.status} />
            </ItemContainer>
        </Right>
      </HalfGrid>
      <Tabs style={shadowStyle}>
        <TabPane tab={aboutTab}>

          <AboutGrid>
          <div><h2>About this Activity</h2></div><ItemDescription>
            <Markdown
              style={{ width: '100%' }}
              children={description}
              options={{
                overrides: {
                  Button: { component: Button }
                }
              }}
            />
          </ItemDescription>
          </AboutGrid>
          <Divider />
          <AboutGrid>

          <div><h2>Organised by</h2></div>
          <div>
            <ItemIdLine item={op.offerOrg} path='orgs' />
            <ItemIdLine item={op.requestor} path='people' />
            </div>
  
          </AboutGrid>
          
        </TabPane>
        <TabPane tab={questionTab} />
        <TabPane tab={manageTab} />
        <TabPane tab={editTab} />
      </Tabs>
    </>
  )
}

OpDetail.propTypes = {
  op: PropTypes.shape({
    name: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.any,
    description: PropTypes.string,
    duration: PropTypes.string,
    status: PropTypes.string
  })
}

export default OpDetail
