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

const { TextArea } = Input

const AboutGrid = styled.div`
  margin: 2rem 0;
  display: grid;
  grid-template-columns: 25rem 1fr;
  gap: 5rem;
  text-align: left;
`

const AskContainer = styled.div`
  padding: 1rem;
  width: 100%;
  background: #ffffff;
  box-shadow: 2px 2px 12px 0 rgba(190, 190, 190, 0.5);
  border-radius: 8px;
`

const ButtonContainer = styled.div`
margin-top: 1rem;
`

export function OpQuestion ({ op }) {
  return (
    <>
      <AboutGrid>
        <div>
          <h2>Questions</h2>
        </div>
          <AskContainer>
            <TextArea rows={4} placeholder='Ask a question here' />
            <ButtonContainer><Button type='primary'>Submit</Button></ButtonContainer>
          </AskContainer>
      </AboutGrid>
      <QuestionContainer>
        
      </QuestionContainer>

    </>
  )
}

export default OpQuestion
