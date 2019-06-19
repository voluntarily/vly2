/* Display a grid of opanisation cards from an [op]
 */
import React from 'react'
import { Grid } from '../VTheme/VTheme'
import styled from 'styled-components'
import TitleSection from '../LandingPageComponents/TitleSection.js'

const ActionCard = styled.a`
  width: 18.5rem;
  height: 23rem;
  border-radius: 0.5rem;
  box-shadow: 2px 2px 24px 0 rgba(118, 118, 118, 0.5);
  background-color: #fff;
  -webkit-transition: all 0.3s;
    transition: all 0.3s;

  :hover {
    box-shadow: 8px 8px 32px 0 rgba(118, 118, 118, 0.8);

    transform: scale(1.02);

  }
` // end ActionCard

const ActionCardImage = styled.img`` // end ActionCardImage

const ActionCardTitle = styled.h1`
margin: 2rem 1rem 0.5rem 1rem;
  font-size: 20px;
  font-weight: 700;
  color: #000000;
  letter-spacing: -0.38px;
  line-height: 24px;
` // end ActionCardTitle

const ActionCardDescription = styled.p`
font-size: 16px;
color: #000000;
letter-spacing: -0.3px;
margin: 0 1rem 1rem 1rem;
` // ActionCardDescription

const BlockContainer = styled.div`` // BlockContainer

const NextActionBlock = ({ ...props }) => (
  <BlockContainer>
    <TitleSection title='To get started, here are a few things we recommend doing:' />
    <Grid>
      <ActionCard href='http://google.com' target='_blank'>
        <ActionCardImage src='./static/img/actions/seeCommitment.png' />
        <ActionCardTitle>See your commitment</ActionCardTitle>
        <ActionCardDescription>You signed up to ACTIVITY @ LOCATION</ActionCardDescription>
      </ActionCard>
      <ActionCard href='../'>
        <ActionCardImage src='./static/img/actions/discoverActs.png' />
        <ActionCardTitle>Find someone to help</ActionCardTitle>
        <ActionCardDescription>Bring volunteers into your school to talk about their careers. Great for inspiring students.</ActionCardDescription>
      </ActionCard>
      <ActionCard>
        <ActionCardImage src='./static/img/actions/ident.png' />
        <ActionCardTitle>Verify your identity</ActionCardTitle>
        <ActionCardDescription>Some awesome activities can only be seen once you verify your identity.</ActionCardDescription>
      </ActionCard>
      <ActionCard>
        <ActionCardImage src='./static/img/actions/tryTemplates.png' />
        <ActionCardTitle>Help build the platform</ActionCardTitle>
        <ActionCardDescription>Contributing to the codebase empowers other awesome volunteers to reach more people.</ActionCardDescription>
      </ActionCard>
      <ActionCard href='http://google.com' target='_blank'>
        <ActionCardImage src='./static/img/actions/seeCommitment.png' />
        <ActionCardTitle>Complete your profile</ActionCardTitle>
        <ActionCardDescription>You signed up to ACTIVITY @ LOCATION</ActionCardDescription>
      </ActionCard>
      <ActionCard href='../'>
        <ActionCardImage src='./static/img/actions/bringVolunteers.png' />
        <ActionCardTitle>Bring in Volunteers</ActionCardTitle>
        <ActionCardDescription>Bring volunteers into your school to talk about their careers. Great for inspiring students.</ActionCardDescription>
      </ActionCard>
      <ActionCard>
        <ActionCardImage src='./static/img/actions/makeRequest.png' />
        <ActionCardTitle>Ask for stuff</ActionCardTitle>
        <ActionCardDescription>Some awesome activities can only be seen once you verify your identity.</ActionCardDescription>
      </ActionCard>
      <ActionCard>
        <ActionCardImage src='./static/img/actions/tryTemplates.png' />
        <ActionCardTitle>Try templates</ActionCardTitle>
        <ActionCardDescription>Contributing to the codebase empowers other awesome volunteers to reach more people.</ActionCardDescription>
      </ActionCard>
    </Grid>
  </BlockContainer>
)

export default NextActionBlock
