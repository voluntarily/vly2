import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import styled from 'styled-components'

import {
  TextBigTitle,
  TextH1,
  TextSubtitle,
  TextPBold,
  TextP,
  TextH3,
  TextHeading,
  TextHeadingBold,
  TextHeadingBlack,
  BigQuote,
  BigQuoteAuthor
} from '../VTheme/VTheme'
import { Divider } from 'antd'

const StoryIntroContainer = styled.div`
  margin: 4rem auto 0 auto;
  width: 60vw;
`

storiesOf('Welcome', module)
  .add('Getting Started', () => (
    <StoryIntroContainer>
      <h1>Welcome</h1>
      <div>
        <p>
          Welcome to the Voluntarily Component Library. We currently use React,
          Next.JS and Styled Components to drive frontend development.
        </p>
        <p>Components are separated into things</p>
        <code>./components/!COMPONENTS!</code>
      </div>
    </StoryIntroContainer>
  ))
  .add('Typography', () => (
    <StoryIntroContainer>
      <TextSubtitle>Hero Title Text</TextSubtitle>
      <TextBigTitle>I am a hero title. </TextBigTitle>
      <TextPBold>Notes</TextPBold>
      <TextP>
        I only get used on the landing and marketing pages atm. Use me very
        sparringly.
      </TextP>
      <br />
      <TextPBold>Code</TextPBold>
      <code>{TextHeroText}</code>
      <Divider />
      <TextSubtitle>H1 Text</TextSubtitle>
      <TextH1>I am a H1 heading. Page titles use me</TextH1>
      <TextPBold>Code</TextPBold>
      <code>{TextH1Text}</code>
      <Divider />
      <TextSubtitle>Subtitle Text</TextSubtitle>
      <TextSubtitle>
        I am subtitle text usually used underneath h1 and hero title text
      </TextSubtitle>
      <br />
      <TextPBold>Code</TextPBold>
      <code>{SubtitleText}</code>
      <Divider />
      <TextSubtitle>H4 Text Heading Black</TextSubtitle> <br />
      <TextHeadingBlack>I am a H4 Text Heading Black</TextHeadingBlack>
      <br />
      <TextPBold>Code</TextPBold>
      <code>{TextH4BlackText}</code>
      <Divider />
      <TextSubtitle>H4 Text Heading Bold</TextSubtitle> <br />
      <TextHeadingBold>I am a H4 Text Heading</TextHeadingBold>
      <br />
      <TextPBold>Code</TextPBold>
      <code>{TextH4BoldText}</code>
      <Divider />
      <TextSubtitle>H4 Text Heading</TextSubtitle> <br />
      <TextHeading>I am a H4 Text Heading</TextHeading>
      <br />
      <TextPBold>Code</TextPBold>
      <code>{TextH4Text}</code>
      <Divider />
      {/* <TextSubtitle>H5 Heading</TextSubtitle>
      <TextH3>I am a H5 Heading</TextH3>
      <br />
      <TextPBold>Code</TextPBold>
      <code>{SubtitleText}</code>
      <Divider /> */}
      <TextSubtitle>P Bold Body Text</TextSubtitle> <br />
      <TextPBold>
        I am P Bold Body Text. Benchmarking, say/do ratio, benchmarking, EBITDA
        - all are competing for the attention of stakeholders. Going forward,
        the key to enterprise content management is recalibration. The critical
        and fast-evolving quality control strengthens the Chief Digital Officer.
        In the future, we look forward to working together to manage the
        balance. Value propositions challenge us to benchmark the portfolio. The
        hybridation credibly influences the disruptors ensuring a solid
        profitability.
      </TextPBold>
      <br />
      <TextPBold>Code</TextPBold>
      <code>{TextPBoldText}</code>
      <Divider />
      <TextSubtitle>P Body Text</TextSubtitle> <br />
      <TextP>
        I am P Body Text. Benchmarking, say/do ratio, benchmarking, EBITDA - all
        are competing for the attention of stakeholders. Going forward, the key
        to enterprise content management is recalibration. The critical and
        fast-evolving quality control strengthens the Chief Digital Officer. In
        the future, we look forward to working together to manage the balance.
        Value propositions challenge us to benchmark the portfolio. The
        hybridation credibly influences the disruptors ensuring a solid
        profitability.
      </TextP>
      <br />
      <TextPBold>Code</TextPBold>
      <code>{TextPText}</code>
      <Divider />
      <TextSubtitle>Quote Block</TextSubtitle> <br />
      <BigQuote>
&ldquo;The game is all about disintermediation, operating model, image,
        pre-plan, and architecture - not concept, Organizational Intelligence,
        issue, global touch-base, and customer centricity.&rdquo;
      </BigQuote>
      <BigQuoteAuthor>— Legitimate Business Human</BigQuoteAuthor>
      <br />
      <TextPBold>Quote</TextPBold>
      <code>{TextQuoteA}<br/>{TextQuoteB}</code>
      <Divider />
    </StoryIntroContainer>
  )).add('Colors', () => ( <StoryIntroContainer>
    <TextH1>Color Guide</TextH1>
    <TextSubtitle>These are the color palettes that we use on the Voluntarily platform</TextSubtitle>
    
    <ColorGrid>
    
    
    </ColorGrid>

  </StoryIntroContainer>
    
    ))




const ColorGrid = styled.div`
display: grid;
grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
gap: 1rem;
`

const ColorContainer = styled.div`

`

const TextHeroText = '<TextBigTitle>I am a hero title</TextBigTitle>'
const TextH1Text = '<TextH1>I am a h1 heading</TextH1>'
const SubtitleText = '<TextSubtitle>I am subtitle text</TextSubtitle>'
const TextH4Text = '<TextH4>I am H4 Text</TextH4>'
const TextH4BoldText = '<TextH4Bold>I am H4 Text Bold</TextH4Bold>'
const TextH4BlackText = '<TextH4Black>I am H4 Text Black</TextH4Black>'
const TextPBoldText = '<TextPBold>I am P Text</TextPBold>'
const TextPText = '<TextP>I am P Text</TextP>'
const TextQuoteA = '<BigQuote>  &ldquo; Super-inspirational quote &rdquo;  </BigQuote>'
const TextQuoteB = '<BigQuoteAuthor>  -Rando Inspirational person  </BigQuoteAuthor>'
