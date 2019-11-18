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
  margin: 2rem 0 0 0;
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

  width: 80rem;


`
//start question
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
    width: 50%;
    margin-top: 0.2rem;
    margin-left: 0.5rem;
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
//end question

//start response
const Response = styled.div`
margin-top: 1rem;
display: grid;
grid-template-columns: 8rem 45rem;
gap: 1rem;
float: right;
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
          <h2>Questions</h2>
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



        <DateBlock>
         <p>29 Jan 2019<br/>11:59PM</p>
       </DateBlock>
       <ContentCard>
          <h3>Can I get free parking at the school? </h3>
          <QuestionDetail>
          <img />
          <p>Legitimate Name</p>
     
 
          <Button shape="round" type='secondary' block>Reply</Button>
      
          </QuestionDetail>
          </ContentCard>


        </Question>
        <Response>
        <DateBlock>
         <p>29 Jan 2019<br/>11:59PM</p>
       </DateBlock>
       <ContentCard>
          <h4>Yeah, text me at 027 123 4567 when you get close to the school</h4>
          <QuestionDetail>
          <img />
          <p>Legitimate Name</p>
          <Button shape="round" type='secondary' block>Reply</Button>
          </QuestionDetail>
          </ContentCard>
        </Response>
        
        

      </QuestionSection>
    </>
  )
}

export default OpQuestion
