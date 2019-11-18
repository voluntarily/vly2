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
import { HalfGrid, Spacer, PBold } from '../VTheme/VTheme'
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
  margin-top: 0.5rem;
`

const QuestionSection = styled.div`
  float: right;
  width: 50rem;
`
//start question
const Question = styled.div`
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

  p {
    width: 50%;
    margin-top: 0.2rem;
    margin-left: 0.5rem;
  }

  img {
    height: 2rem;
    width: 2rem;
    float: left;
    background-color: purple;
    border-radius: 150px;
  }
`




const QuestionDetail = styled.div`
display: grid;
grid-template-columns: 2rem 1fr 7rem;
`
//end question

//start response
const Response = styled.div`
margin-top: 1rem;
`


//end response

//start date block
const DateBlock = styled.div`


p {
padding-top: 2rem;
color: #555555;
letter-spacing: -0.3px;
text-align: right;
line-height: 24px;

}

`

//end date block



export function OpQuestion ({ op }) {
  return (
    <>
      <AboutGrid>
        <div>
          <h2>Questions LOL</h2>
        </div>
        <AskContainer>
          <TextArea rows={3} placeholder='Ask a question here' />
          <ButtonContainer>
            <Button shape="round" type='primary'>Submit</Button>
          </ButtonContainer>
        </AskContainer>
      </AboutGrid>
      <QuestionSection>
        <Question>
       
          <h3>Can I get free parking at the school? Can I get free parking at the school? Can I get free parking at the school? Can I get free parking at the school? </h3>
          <QuestionDetail>
          <img />
          <p>Legitimate Name</p>
     
 
          <Button shape="round" type='primary' block>Reply</Button>
    
          </QuestionDetail>
        </Question>
        <Response>

        </Response>

      </QuestionSection>
    </>
  )
}

export default OpQuestion
