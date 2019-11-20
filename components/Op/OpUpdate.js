/* Dumb React component Shows contents of an opportunity
 */
import { FormattedMessage } from 'react-intl'
import { Button, Divider, Tabs, Input } from 'antd'
import Markdown from 'markdown-to-jsx'
import styled from 'styled-components'
import moment from 'moment'
import Head from 'next/head'
import PropTypes from 'prop-types'
import React from 'react'
import TagDisplay from '../Tags/TagDisplay'
import { HalfGrid, Spacer, PBold, OpSectionGrid } from '../VTheme/VTheme'
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

const { TextArea } = Input

const AskContainer = styled.div`
  padding: 1rem;
  width: 100%;
  background: #ffffff;
  box-shadow: 2px 2px 12px 0 rgba(190, 190, 190, 0.5);
  border-radius: 8px;
  
`

const ButtonContainer = styled.div`
  margin-top: 0.5rem;
`

const QuestionSection = styled.div`

  width: 80rem;


`
// start question
const ContentCard = styled.div`
  background-color: #ffffff;
  box-shadow: 2px 2px 12px 0 rgba(190, 190, 190, 0.5);
  border-radius: 8px;
  width: 100%;
  padding: 1rem;
  text-align: left;

  h3 {
    font-size: 1.25rem;
    font-weight: bold;
    letter-spacing: -0.38px;
    line-height: 32px;

    margin-bottom: 1rem
  }

  h4 {
    font-size: 1.25rem;
    font-weight: 400;
    letter-spacing: -0.38px;
    line-height: 32px;

    margin-bottom: 1rem
  }

  p {

  }

  img {
    height: 2rem;
    width: 2rem;

    background-color: purple;
    border-radius: 150px;
  }
`

const Question = styled.div`

display: grid;
grid-template-columns: 8rem 50rem;
gap: 1rem;
float: right;
margin-top: 3rem;
`

const QuestionDetail = styled.div`
display: grid;
grid-template-columns: 2rem 1fr 7rem;
`
// end question

// start response
const Response = styled.div`
margin-top: 1rem;
display: grid;
grid-template-columns: 8rem 45rem;
gap: 1rem;
float: right;
`

// end response

// start date block
const DateBlock = styled.div`


p {
padding-top: 2rem;
color: #555555;
letter-spacing: -0.3px;
text-align: right;
line-height: 24px;

}

`

// end date block

export function OpUpdate ({ op }) {
  return (
    <>
      <OpSectionGrid>
        <h2>Updates</h2>
        <ContentCard>
          <h3>Live Telecast rescheduled to December 2024!</h3>
          <p>There can be no cost reduction until we can achieve a rock-solid yield enhancement. A higher-quality, synchronized, integration strengthens the decision makers within the silo.
The clients cross-pollinate the quality-oriented co-innovations ahead of schedule; nevertheless the pioneers reframe our dynamically managed quick-wins.<br /><br />We need to take a bite out of the thought-provoking options. The product manager synergizes real-time on-boarding processes. In the same time, the market thinkers adequately transgenerate changes.
Business platform won't happen without growth engine. Our underlying, low-risk high-yield and inter-company Strategic Management Systems iterate a target, while the decision makers formulate our solution providers. Our execution efficiently reenergizes the facilitator.
Our cognitive strategic staircases interact with a potential shareholder value across the wider Group; nevertheless our ever-changing and/or non-linear digital change operationalizes our nimble, awesome, developer-led and well-scoped correlations. Internally and externally, the visionary commoditizes our top-down expectations.<br /><br />Our sprint-based and extensible responsive design inspires the enabler.
It's not about win-win solutions. It's about an all-encompassing resiliency. Quality assurance requires that we all pull in the same direction. The prioritizing correlations energize the game changers.
The board-level executives consistently transgenerate our siloed ingenuity in the marketplace.
A stress management will be best positioned to re-imagine unmatched, cognitive and cognitive risk appetites, whereas opting out of usage-based leadership strategy is not a choice.
.
          </p><br /><Button shape='round' size='large' type='secondary'>Reply</Button>

        </ContentCard>

      </OpSectionGrid>
    </>
  )
}

export default OpUpdate
