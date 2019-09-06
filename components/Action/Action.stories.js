import React from 'react'
import { storiesOf } from '@storybook/react'
import ActionCard from './ActionCard';
import styled from 'styled-components'
import { StoryIntroContainer } from '../VTheme/VStoryTheme';
import { Grid, P, H3Black } from '../VTheme/VTheme'

const SectionTitleWrapper = styled.div`
  margin: 2rem 0rem;
`

storiesOf('Onboarding Components', module)
  .add('Action Card', () => (
      <StoryIntroContainer>
          <Grid>
    <ActionCard
        image='https://lorempixel.com/296/208/'
        name='Find someone to help'
        description='Teachers are asking for your help. There are many ways to get involved in your community'
        link='../search'
      />
      </Grid>
      </StoryIntroContainer>
 ))

  .add('Get Started List', () => (
      <StoryIntroContainer>

    <SectionTitleWrapper>
      <H3Black>Getting Started</H3Black>
      <P>
        To start volunteering on Voluntarily, here are a few things we recommend
        doing:
      </P>
    </SectionTitleWrapper>
    <Grid>
      <ActionCard
        image='https://lorempixel.com/296/208/technics/1'
        name='Discover'
        description='Discover interesting ways to get involved in your community.'
        link='../search'
      />
      <ActionCard
        image='https://lorempixel.com/296/208/technics/2'
        name='Complete your Profile'
        description='Tell the world about yourself and your skills. Complete profiles score more opportunities to help out!'
      />

      <ActionCard
        image='https://lorempixel.com/296/208/technics/3'
        name='Become School-Safe'
        description='Certain activities need training and verification before you can help out.'
      />
      <ActionCard
        image='https://lorempixel.com/296/208/technics/4'
        name='Contribute to the platform'
        description='Help mobilise more volunteers by contributing. All skill levels are welcome, and training is provided.'
        link='https://github.com/voluntarily/vly2'
      />
      <ActionCard
        image='https://lorempixel.com/296/208/technics/5'
        name='Complete your Profile'
        description='Tell the world about yourself and your skills. Complete profiles score more opportunities to help out!'
      />

      <ActionCard
        image='https://lorempixel.com/296/208/technics/6'
        name='Call in Industry Volunteers'
        description='Invite volunteers into your school to talk about their careers.
        Inspire. Excite. Ignite.'
      />

      <ActionCard
        image='https://lorempixel.com/296/208/technics/7'
        name='Create an Opportunity'
        description='Ask skilled volunteers for help by creating an opportunity to help out.'
      />

      <ActionCard
        image='https://lorempixel.com/296/208/technics/8'
        name='Find Activities'
        description='See templates that other educators have created for you to copy'
      />
    </Grid>

</StoryIntroContainer>
  ))