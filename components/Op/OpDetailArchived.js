/* Dumb React component Shows contents of an opportunity
 */
import { FormattedMessage } from 'react-intl'
import { Button, Divider, Tabs } from 'antd'
import Markdown from 'markdown-to-jsx'
import styled from 'styled-components'
import moment from 'moment'
import Head from 'next/head'
import PropTypes from 'prop-types'
import React from 'react'
import TagDisplay from '../Tags/TagDisplay'
import { HalfGrid, OpSectionGrid } from '../VTheme/VTheme'
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
import { OpQuestion } from './OpQuestion'
import OpUpdate from './OpUpdate'
import { withRouter } from 'next/router'
import { config } from '../../config/config'

const { TabPane } = Tabs

const aboutTab = (
  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
    <FormattedMessage id='orgAbout' />
  </span>
)

const questionTab = (
  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Questions</span>
)

const manageTab = (
  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
    Manage Volunteers
  </span>
)

const updateTab = (
  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Updates</span>
)

const editTab = (
  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Edit Activity</span>
)

const ProfileSection = styled.div`
  margin-top: 2rem;
`

const isNotProd = process.env.NODE_ENV !== 'production'

const ActionContainer = styled.div`
  display: grid;
 
  gap: 2rem;
`

export function OpDetailArchived ({
  op,
  router,
  onEditClicked,
  canEdit,
  canRegisterInterest,
  isAuthenticated,
  me
}) {
  // This will make sure that if the description is undefined we will set it to an empty string
  // Otherwise Markdown will throw error

  const startDate = op.date[0]
    ? moment(op.date[0]).format('h:mmA · ddd DD/MM/YY')
    : 'Negotiable'
  const endDate = op.date[1]
    ? '  →  ' + moment(op.date[1]).format('h:mmA · ddd DD/MM/YYYY')
    : ' '
  const img = op.imgUrl || '.././static/missingimage.svg'

  const shadowStyle = { overflow: 'visible', textAlign: 'center' }

  const handleTabChange = (key, e) => {
    if (key === '5') {
      onEditClicked()
    }
  }
  const description = op.description || ''
  const requestor = op.requestor || ''
  const creator = `@${requestor.name || ''}`
  const appUrl = `${config.appUrl}${router.asPath}`

  return (
    <section>
      <Head>
        <title>Voluntarily - {op.name}</title>
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:site' content='@voluntarilyHQ' />
        <meta name='twitter:creator' content={creator} />
        <meta property='og:url' content={appUrl} />
        <meta property='og:title' content={op.name} />
        <meta property='og:description' content={description} />
        <meta property='og:image' content={img} />
      </Head>
      <HalfGrid>
        <Left>
          <ItemImage src={img} alt={op.name} />
        </Left>
        <Right>
          <h1>{op.name}</h1>
          <h4>{op.location}</h4>
          <ItemContainer>
            <ItemDuration duration={op.duration} />
            <ItemDate startDate={startDate} endDate={endDate} />
            <ItemStatus status={op.status} />
          </ItemContainer>
          <ActionContainer />

        </Right>
      </HalfGrid>
      <ProfileSection>
        <Tabs
          style={shadowStyle}
          defaultActiveKey='1'
          onChange={handleTabChange}
        >
          <TabPane tab={aboutTab} key='1'>
            <OpSectionGrid>
              <div>
                <h2>About this Activity</h2>
              </div>
              <ItemDescription>
                <Markdown
                  style={{ width: '100%' }}
                  children={description}
                  options={{
                    overrides: {
                      Button: { component: Button }
                    }
                  }}
                />
                <TagContainer>
                  <Divider />
                  <h5>
                    <FormattedMessage
                      id='opTags'
                      defaultMessage='Tags'
                      description='Tags on an opportunity'
                    />
                  </h5>
                  <TagDisplay tags={op.tags} />
                </TagContainer>
              </ItemDescription>
            </OpSectionGrid>
            <Divider />

            <OpSectionGrid>
              <div>
                <h2>Organised by</h2>
              </div>

              <div>
                <ItemIdLine item={op.offerOrg} path='orgs' />
                <ItemIdLine item={op.requestor} path='people' />
              </div>
            </OpSectionGrid>
          </TabPane>
          {isNotProd && (
            <TabPane tab={questionTab} key='2'>
              <OpQuestion />
            </TabPane>
          )}
          {isNotProd && (
            <TabPane tab={updateTab} key='3'>
              <OpUpdate />
            </TabPane>
          )}
          {canEdit && <TabPane tab={manageTab} key='4' />}
          {canEdit && <TabPane tab={editTab} key='5' />}
        </Tabs>
      </ProfileSection>
    </section>
  )
}

OpDetailArchived.propTypes = {
  op: PropTypes.shape({
    name: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.any,
    description: PropTypes.string,
    duration: PropTypes.string,
    status: PropTypes.string
  })
}

export default withRouter(OpDetailArchived)
