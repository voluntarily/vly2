/* Display a grid of opanisation cards from an [op]
 */
import React from 'react'
import { Grid } from '../VTheme/VTheme'
import ActionCard from './ActionCard'
import styled from 'styled-components'

const BlockContainer = styled.div`` // BlockContainer
const SectionTitleWrapper = styled.div`
  margin: 2rem 0rem;
`
const NextActionBlockV2 = ({ ...props }) => (
  <BlockContainer>
    <SectionTitleWrapper>
      <h2>Getting Started</h2>
      <h5>To get started, try an activity below.</h5>
    </SectionTitleWrapper>
    <Grid>
      <ActionCard
        image='/static/img/actions/teacherSetup.png'
        name='Tell us about your school'
        description='Tell the world about your awesome school - Complete profiles attract more volunteers!'
      />

      <ActionCard
        image='/static/img/actions/itf.png'
        name='Call in Industry Volunteers'
        description='Invite volunteers into your school to talk about their careers.
        Inspire. Excite. Ignite.'
      />

      <ActionCard
        image='/static/img/actions/discoverActs.png'
        name='Discover'
        description='Discover interesting ways to get involved in your community.'
        link='/search'
      />
      <ActionCard
        image='/static/img/actions/profile2.png'
        name='Register as a Requestor'
        description='If you are a teacher, click here to enable creating new requests for volunteers.'
        link='/action/registerTeacher'
      />

      <ActionCard
        image='/static/img/actions/ident.png'
        name='Become School-Safe'
        description='Certain activities need training and verification before you can help out.'
      />
      <ActionCard
        image='/static/img/actions/github.png'
        name='Contribute to the platform'
        description='Help mobilise more volunteers by contributing. All skill levels are welcome, and training is provided.'
        link='https://github.com/voluntarily/vly2'
      />
      <ActionCard
        image='/static/img/actions/profile.png'
        name='Complete your Profile'
        description='Tell the world about yourself and your skills. Complete profiles score more opportunities to help out!'
      />

      <ActionCard
        image='/static/img/actions/createOp.png'
        name='Create an Opportunity'
        description='Ask skilled volunteers for help by creating an opportunity to help out.'
      />

      <ActionCard
        image='/static/img/actions/createAct.png'
        name='Find Activities'
        description='See templates that other educators have created for you to copy'
      />
    </Grid>
  </BlockContainer>
)

export default NextActionBlockV2
