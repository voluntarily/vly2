/* Display a grid of opanisation cards from an [op]
 */
import React from 'react'
import { Grid, H3Black, P } from '../VTheme/VTheme'
import ActionCard from '../Action/ActionCard'
import styled from 'styled-components'

const BlockContainer = styled.div`` // BlockContainer

const SectionTitleWrapper = styled.div`
  margin: 2rem 0rem;
`

const NextActionBlock = ({ ...props }) => (
  <BlockContainer>
    <SectionTitleWrapper>
      <H3Black>Getting Started</H3Black>
      <P>
        To start volunteering on Voluntarily, here are a few things we recommend
        doing:
      </P>
    </SectionTitleWrapper>
    <Grid>
      <ActionCard
        image='./static/img/actions/discoverActs.png'
        name='Find someone to help'
        description='Teachers are asking for your help. There are many ways to get involved in your community'
        link='../search'
      />
      <ActionCard
        image='./static/img/actions/tryTemplates.png'
        name='Contribute to the platform'
        description='Help mobilise more volunteers by contributing. All skill levels are welcome, and training is provided.'
        link='https://github.com/voluntarily/vly2'
      />

    </Grid>
  </BlockContainer>
)

export default NextActionBlock
