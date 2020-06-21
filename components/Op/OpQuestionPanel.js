/* Dumb React component Shows contents of an opportunity
 */

import { Button, Input } from 'antd'

import styled from 'styled-components'

import React from 'react'

import { OpSectionGrid } from '../VTheme/VTheme'

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

    margin-bottom: 1rem;
  }

  h4 {
    font-size: 1.25rem;
    font-weight: 400;
    letter-spacing: -0.38px;
    line-height: 32px;

    margin-bottom: 1rem;
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
  grid-template-columns: 8rem 1fr;
  gap: 1rem;
  float: right;
  margin-top: 2rem;
  width: 59rem;

  @media screen and (min-width: 768px) and (max-width: 1281px) {
    width: calc(100vw - 2rem);
  }

  @media screen and (max-width: 768px) {
    width: calc(100vw - 2rem);
    grid-template-columns: 1fr;
    margin-top: 1rem;
    float: left;
  }
`

const QuestionDetail = styled.div`
  display: grid;
  grid-template-columns: 2rem 1fr 7rem;
  @media screen and (max-width: 768px) {
    grid-template-columns: 2rem 1fr 6rem;
  
  }
`
// end question

// start response
const Response = styled.div`
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 8rem 45rem;
  gap: 1rem;
  float: right;

  @media screen and (min-width: 768px) and (max-width: 1281px) {
    width: calc(100vw - 2rem);
    grid-template-columns: 8rem calc(100vw - 14rem);

  }

  @media screen and (max-width: 768px) {
    margin-top: 0rem;
    width: calc(100vw - 5rem);
    grid-template-columns: calc(100vw - 5rem);
    float: right;
  }
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


  @media screen and (max-width: 768px) {
display: none;
  }
  }
`

// end date block

export function OpQuestionPanel ({ op }) {
  return (
    <>
      <OpSectionGrid>
        <div>
          <h2>Questions</h2>
        </div>
        <AskContainer>
          <p>Got any questions?</p>
          <TextArea rows={3} placeholder='Type your a question here' />
          <ButtonContainer>
            <Button shape='round' size='large' type='primary'>
              Submit
            </Button>
          </ButtonContainer>
        </AskContainer>
      </OpSectionGrid>

      <QuestionSection>
        <Question>
          <DateBlock>
            <p>
              29 Jan 2019
              <br />
              11:59PM
            </p>
          </DateBlock>
          <ContentCard>
            <h3>Can I get free parking at the school? </h3>
            <QuestionDetail>
              <img />
              <p>Legitimate Name</p>

              <Button shape='round' size='large' type='secondary' block>
                Reply
              </Button>
            </QuestionDetail>
          </ContentCard>
        </Question>
        <Response>
          <DateBlock>
            <p>
              29 Jan 2019
              <br />
              11:59PM
            </p>
          </DateBlock>
          <ContentCard>
            <h4>
              Yeah, text me at 027 123 4567 when you get close to the school
            </h4>
            <QuestionDetail>
              <img />
              <p>Legitimate teacher</p>
              <Button shape='round' size='large' type='secondary' block>
                Reply
              </Button>
            </QuestionDetail>
          </ContentCard>
        </Response>
        <Question>
          <DateBlock>
            <p>
              29 Jan 2019
              <br />
              11:59PM
            </p>
          </DateBlock>
          <ContentCard>
            <h3>Can I get free parking at the school? </h3>
            <QuestionDetail>
              <img />
              <p>Legitimate Name</p>

              <Button shape='round' size='large' type='secondary' block>
                Reply
              </Button>
            </QuestionDetail>
          </ContentCard>
        </Question>
        <Response>
          <DateBlock>
            <p>
              29 Jan 2019
              <br />
              11:59PM
            </p>
          </DateBlock>
          <ContentCard>
            <h4>
              Yeah, text me at 027 123 4567 when you get close to the school
            </h4>
            <QuestionDetail>
              <img />
              <p>Legitimate teacher</p>
              <Button shape='round' size='large' type='secondary' block>
                Reply
              </Button>
            </QuestionDetail>
          </ContentCard>
        </Response>
        <Question>
          <DateBlock>
            <p>
              29 Jan 2019
              <br />
              11:59PM
            </p>
          </DateBlock>
          <ContentCard>
            <h3>Can I get free parking at the school? </h3>
            <QuestionDetail>
              <img />
              <p>Legitimate Name</p>

              <Button shape='round' size='large' type='secondary' block>
                Reply
              </Button>
            </QuestionDetail>
          </ContentCard>
        </Question>
        <Response>
          <DateBlock>
            <p>
              29 Jan 2019
              <br />
              11:59PM
            </p>
          </DateBlock>
          <ContentCard>
            <h4>
              Yeah, text me at 027 123 4567 when you get close to the school
            </h4>
            <QuestionDetail>
              <img />
              <p>Legitimate teacher</p>
              <Button shape='round' size='large' type='secondary' block>
                Reply
              </Button>
            </QuestionDetail>
          </ContentCard>
        </Response>

      </QuestionSection>
    </>
  )
}

export default OpQuestionPanel
