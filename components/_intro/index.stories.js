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
  BigQuoteAuthor,
  Grid
} from '../VTheme/VTheme'
import {
  StoryIntroContainer,
  ColorGrid,
  ColorContainer,
  ColorSwatch
} from '../VTheme/VStoryTheme'

import { Divider } from 'antd'

storiesOf('Welcome', module)
  .add('Getting Started', () => (
    <StoryIntroContainer>
      <TextH1>Welcome!</TextH1>
      <TextSubtitle>This is the Voluntarily Component Library 🥳🥳🥳</TextSubtitle>
      <Divider/>
      <TextSubtitle>All frontend development for the Voluntarily Platform starts here. Browse the components we use on the left, and tinker with them here without the risk of breaking anything 😂<br/> Open_Sauce (or open source) contributions are welcome, and enjoy yourself while you're here :) <br/>
      <li><a href="https://github.com/voluntarily/vly2" target="_blank">See the repo here</a></li>
      <li><a href="https://github.com/voluntarily/vly2" target="_blank">Get Started with Mac</a></li>
      <li><a href="https://github.com/voluntarily/vly2" target="_blank">Get Started with Windows</a></li>
      <li><a href="https://github.com/voluntarily/vly2" target="_blank">Get Started with Linux</a></li>
      </TextSubtitle>
      
    </StoryIntroContainer>
  ))
  .add('Typography', () => (
    <StoryIntroContainer>
      <TextH1>Text Styles</TextH1>
      <TextSubtitle>How we do text and typography on the platform</TextSubtitle>
      <Divider/>
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
      <code>
        {TextQuoteA}
        <br />
        {TextQuoteB}
      </code>
      <Divider />
    </StoryIntroContainer>
  ))
  .add('Colors', () => (
    <StoryIntroContainer>
      <TextH1>Color Guide</TextH1>
      <TextSubtitle>
        These are the color palettes that we use on the Voluntarily platform.
        Inspired by Material Design
      </TextSubtitle>
      <Divider />
      <TextH3>Primary Colors</TextH3>
      <ColorGrid>
        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#653CAD' }} />
          <TextHeadingBold>#653CAD</TextHeadingBold>
          <TextP>
            Purple - for links, buttons and all things clicky. Use me sparingly.
          </TextP>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#F35627' }} />
          <TextHeadingBold>#F35627</TextHeadingBold>
          <TextP>Orange - for illustrations and guides</TextP>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#222222' }} />
          <TextHeadingBold>#222222</TextHeadingBold>
          <TextP>Grays - for drop shadows and splitter components</TextP>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#F44336' }} />
          <TextHeadingBold>#F44336</TextHeadingBold>
          <TextP>
            Red - for Alerts and when things to terribly wrong - Use me
            sparingly.
          </TextP>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#36F482' }} />
          <TextHeadingBold>#36F482</TextHeadingBold>
          <TextP>
            Green - for success states and checks in lists - Use me sparingly.
          </TextP>
        </ColorContainer>
      </ColorGrid>

      <Divider />
      <TextH3>Text Colors</TextH3>
      <ColorGrid>
        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#000000' }} />
          <TextHeadingBold>#000000</TextHeadingBold>
          <TextP>Black - used for most text</TextP>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#222222' }} />
          <TextHeadingBold>#222222</TextHeadingBold>
          <TextP>Gray - used for secondary text</TextP>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch
            style={{ backgroundColor: '#ffffff', border: '1px solid grey' }}
          />
          <TextHeadingBold>#ffffff</TextHeadingBold>
          <TextP>White - used for button text</TextP>
        </ColorContainer>
      </ColorGrid>

      <Divider />
      <TextH3>Awesomesauce Purple</TextH3>
      <TextP>
        Used for links, buttons and their respective states like hover, after,
        disabled, etc
      </TextP>
      <ColorGrid>
        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#EAE2F8' }} />
          <TextHeadingBold>#EAE2F8</TextHeadingBold>
          <TextP>Purple - 50</TextP>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#CFBCF2' }} />
          <TextHeadingBold>#CFBCF2</TextHeadingBold>
          <TextP>Purple - 100</TextP>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#A081D9' }} />
          <TextHeadingBold>#A081D9</TextHeadingBold>
          <TextP>Purple - 200</TextP>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#8663C7' }} />
          <TextHeadingBold>#8663C7</TextHeadingBold>
          <TextP>Purple - 300</TextP>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#724BB7' }} />
          <TextHeadingBold>#724BB7</TextHeadingBold>
          <TextP>Purple - 400</TextP>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#653CAD' }} />
          <TextHeadingBold>#653CAD</TextHeadingBold>
          <TextP>Purple - 500 Primary</TextP>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#51279B' }} />
          <TextHeadingBold>#51279B</TextHeadingBold>
          <TextP>Purple - 600</TextP>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#421987' }} />
          <TextHeadingBold>#421987</TextHeadingBold>
          <TextP>Purple - 700</TextP>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#34126F' }} />
          <TextHeadingBold>#34126F</TextHeadingBold>
          <TextP>Purple - 800</TextP>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#240754' }} />
          <TextHeadingBold>#240754</TextHeadingBold>
          <TextP>Purple - 900</TextP>
        </ColorContainer>
      </ColorGrid>

      <Divider />
      <TextH3>Annoying Orange</TextH3>
      <TextP>Used for illustrations and tutorial / onboarding components</TextP>
      <ColorGrid>
        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#FFE8D9' }} />
          <TextHeadingBold>#FFE8D9</TextHeadingBold>
          <TextP>Orange - 50</TextP>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#FFD0B5' }} />
          <TextHeadingBold>#FFD0B5</TextHeadingBold>
          <TextP>Orange - 100</TextP>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#FFB088' }} />
          <TextHeadingBold>#FFB088</TextHeadingBold>
          <TextP>Orange - 200</TextP>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#FF9466' }} />
          <TextHeadingBold>#FF9466</TextHeadingBold>
          <TextP>Orange - 300</TextP>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#F9703E' }} />
          <TextHeadingBold>#F9703E</TextHeadingBold>
          <TextP>Orange - 400</TextP>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#F35627' }} />
          <TextHeadingBold>#F35627</TextHeadingBold>
          <TextP>Orange - 500 Primary</TextP>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#DE3A11' }} />
          <TextHeadingBold>#DE3A11</TextHeadingBold>
          <TextP>Orange - 600</TextP>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#C52707' }} />
          <TextHeadingBold>#C52707</TextHeadingBold>
          <TextP>Orange - 700</TextP>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#AD1D06' }} />
          <TextHeadingBold>#AD1D06</TextHeadingBold>
          <TextP>Orange - 800</TextP>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#841003' }} />
          <TextHeadingBold>#841003</TextHeadingBold>
          <TextP>Orange - 900</TextP>
        </ColorContainer>
      </ColorGrid>

      <Divider />
      <TextH3>Gilded Grays</TextH3>
      <TextP>Used for drop shadows and background elements like dividers</TextP>
      <ColorGrid>
        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#F7F7F7' }} />
          <TextHeadingBold>#F7F7F7</TextHeadingBold>
          <TextP>Gray - 50</TextP>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#E1E1E1' }} />
          <TextHeadingBold>#E1E1E1</TextHeadingBold>
          <TextP>Gray - 100</TextP>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#CFCFCF' }} />
          <TextHeadingBold>#CFCFCF</TextHeadingBold>
          <TextP>Gray - 200</TextP>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#B1B1B1' }} />
          <TextHeadingBold>#B1B1B1</TextHeadingBold>
          <TextP>Gray - 300</TextP>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#9E9E9E' }} />
          <TextHeadingBold>#9E9E9E</TextHeadingBold>
          <TextP>Gray - 400</TextP>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#7E7E7E' }} />
          <TextHeadingBold>#7E7E7E</TextHeadingBold>
          <TextP>Gray - 500 Primary</TextP>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#626262' }} />
          <TextHeadingBold>#626262</TextHeadingBold>
          <TextP>Gray - 600</TextP>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#515151' }} />
          <TextHeadingBold>#515151</TextHeadingBold>
          <TextP>Gray - 700</TextP>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#3B3B3B' }} />
          <TextHeadingBold>#3B3B3B</TextHeadingBold>
          <TextP>Gray - 800</TextP>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#222222' }} />
          <TextHeadingBold>#222222</TextHeadingBold>
          <TextP>Gray - 900</TextP>
        </ColorContainer>
      </ColorGrid>
    </StoryIntroContainer>
  ))
  .add('Grids', () => (
    <StoryIntroContainer>
      <TextH1>Grid System Guide</TextH1>  <br />
      <TextSubtitle>
        Most of the Voluntarily Platform fits within a 1280-pixel wide container
        that scales down on mobile.
        <br /> This is inspired by the{' '}
        <a href='https://bbc.github.io/gel-grid/'>BBC GEL Grid system</a>, but
        isn't as strict or comprehensive.
      </TextSubtitle>
      <br />
      <Divider />
      <TestWidthItem />
      <Divider />
      <TextSubtitle>
       Our default grid uses a 4 column track as well, and this scales down based on available width.
      </TextSubtitle>
      <br />
      <br />
      <Grid><TestWidthItem /><TestWidthItem /><TestWidthItem /><TestWidthItem /><TestWidthItem /><TestWidthItem /><TestWidthItem /><TestWidthItem /></Grid>

    </StoryIntroContainer>
  ))

const TestWidthItem = styled.div`
  height: 10rem;
  max-width: 1280px;
  background-color: purple;
`

const TextHeroText = '<TextBigTitle>I am a hero title</TextBigTitle>'
const TextH1Text = '<TextH1>I am a h1 heading</TextH1>'
const SubtitleText = '<TextSubtitle>I am subtitle text</TextSubtitle>'
const TextH4Text = '<TextH4>I am H4 Text</TextH4>'
const TextH4BoldText = '<TextH4Bold>I am H4 Text Bold</TextH4Bold>'
const TextH4BlackText = '<TextH4Black>I am H4 Text Black</TextH4Black>'
const TextPBoldText = '<TextPBold>I am P Text</TextPBold>'
const TextPText = '<TextP>I am P Text</TextP>'
const TextQuoteA =
  '<BigQuote>  &ldquo; Super-inspirational quote &rdquo;  </BigQuote>'
const TextQuoteB =
  '<BigQuoteAuthor>  -Rando Inspirational person  </BigQuoteAuthor>'
