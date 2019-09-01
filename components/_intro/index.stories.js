import React from 'react'

import { storiesOf } from '@storybook/react'

import styled from 'styled-components'

import {
  TextBigTitle,
  H1,
  H4,
  PBold,
  P,
  H3,
  H3Bold,
  H3Black,
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
      <H1> 🥳 Welcome 🥳</H1>
      <H4>This is the Voluntarily Component Library </H4>
      <Divider />
      <H4>All frontend development for the Voluntarily Platform starts here. Browse the components we use on the left, and tinker with them here without the risk of breaking anything 😂<br /> Open-Sauce (or Open Source) contributions are welcome, and enjoy yourself while you're here :) <br /><br />
        <li><a href='https://github.com/voluntarily/vly2' target='_blank'> 🎒 See the repo here</a></li>
        <li><a href='https://github.com/voluntarily/vly2/blob/master/docs/gettingstarted.md' target='_blank'>💻 Get Started with Windows, Mac, or Linux</a></li>

      </H4>

    </StoryIntroContainer>
  ))
  .add('Typography', () => (
    <StoryIntroContainer>
      <H1>Text Styles</H1>
      <H4>How we do text and typography on the platform</H4>
      <Divider />
      <H4>Hero Title Text</H4>
      <TextBigTitle>I am a hero title.</TextBigTitle>
      <PBold>Notes</PBold>
      <P>
        I only get used on the landing and marketing pages atm. Use me very
        sparringly.
      </P>
      <br />
      <PBold>Code</PBold>
      <code>{TextHeroText}</code>
      <Divider />
      <H4>H1 Text - Page Titles</H4>
      <H1>I am a H1 heading.</H1>
      <PBold>Notes</PBold>
      <P>
        I am used on page titles
      </P>
      <br />
      <PBold>Code</PBold>
      <code>{TextH1Text}</code>
      <Divider />
      <H4>H3 Text Heading Black</H4> <br />
      <H3Black>I am a H3 Text Heading Black</H3Black>
      <br />
      <PBold>Notes</PBold>
      <P>
        I usually get used on component titles ie: a card set on the landing page  or list of recommendations in your dash
      </P>
      <br />
      <PBold>Code</PBold>
      <code>{TextH4BlackText}</code>
      <Divider />
      <H4>H3 Text Heading Bold</H4> <br />
      <H3Bold>I am a H3 Text Heading Bold</H3Bold>
      <br />
      <PBold>Code</PBold>
      <code>{TextH4BoldText}</code>
      <Divider />
      <H4>H3 Text Heading</H4> <br />
      <H3>I am a H3 Text Heading</H3>
      <br />
      <PBold>Code</PBold>
      <code>{TextH4Text}</code>
      <Divider />
      <H4>H4</H4>
      <H4>
        I am H4 subtitle text usually used underneath h1 and hero title text
      </H4>
      <br />
      <PBold>Code</PBold>
      <code>{SubtitleText}</code>
      <Divider />
      <H4>P Bold Body Text</H4> <br />
      <PBold>
        I am P Bold Body Text. Benchmarking, say/do ratio, benchmarking, EBITDA
        - all are competing for the attention of stakeholders. Going forward,
        the key to enterprise content management is recalibration. The critical
        and fast-evolving quality control strengthens the Chief Digital Officer.
        In the future, we look forward to working together to manage the
        balance. Value propositions challenge us to benchmark the portfolio. The
        hybridation credibly influences the disruptors ensuring a solid
        profitability.
      </PBold>
      <br />
      <PBold>Code</PBold>
      <code>{TextPBoldText}</code>
      <Divider />
      <H4>P Body Text</H4> <br />
      <P>
        I am P Body Text. Benchmarking, say/do ratio, benchmarking, EBITDA - all
        are competing for the attention of stakeholders. Going forward, the key
        to enterprise content management is recalibration. The critical and
        fast-evolving quality control strengthens the Chief Digital Officer. In
        the future, we look forward to working together to manage the balance.
        Value propositions challenge us to benchmark the portfolio. The
        hybridation credibly influences the disruptors ensuring a solid
        profitability.
      </P>
      <br />
      <PBold>Code</PBold>
      <code>{TextPText}</code>
      <Divider />
      <H4>Quote Block</H4> <br />
      <BigQuote>
        &ldquo;The game is all about disintermediation, operating model, image,
        pre-plan, and architecture - not concept, Organizational Intelligence,
        issue, global touch-base, and customer centricity.&rdquo;
      </BigQuote>
      <BigQuoteAuthor>— Legitimate Business Human</BigQuoteAuthor>
      <br />
      <PBold>Quote</PBold>
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
      <H1>Color Guide</H1>
      <H4>
        These are the color palettes that we use on the Voluntarily platform.
        Inspired by Material Design
      </H4>
      <Divider />
      <H3>Primary Colors</H3>
      <ColorGrid>
        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#653CAD' }} />
          <H3Bold>#653CAD</H3Bold>
          <P>
            Purple - for links, buttons and all things clicky. Use me sparingly.
          </P>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#F35627' }} />
          <H3Bold>#F35627</H3Bold>
          <P>Orange - for illustrations and guides</P>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#222222' }} />
          <H3Bold>#222222</H3Bold>
          <P>Grays - for drop shadows and splitter components</P>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#F44336' }} />
          <H3Bold>#F44336</H3Bold>
          <P>
            Red - for Alerts and when things to terribly wrong - Use me
            sparingly.
          </P>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#36F482' }} />
          <H3Bold>#36F482</H3Bold>
          <P>
            Green - for success states and checks in lists - Use me sparingly.
          </P>
        </ColorContainer>
      </ColorGrid>

      <Divider />
      <H3>Text Colors</H3>
      <ColorGrid>
        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#000000' }} />
          <H3Bold>#000000</H3Bold>
          <P>Black - used for most text</P>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#222222' }} />
          <H3Bold>#222222</H3Bold>
          <P>Gray - used for secondary text</P>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch
            style={{ backgroundColor: '#ffffff', border: '1px solid grey' }}
          />
          <H3Bold>#ffffff</H3Bold>
          <P>White - used for button text</P>
        </ColorContainer>
      </ColorGrid>

      <Divider />
      <H3>Awesomesauce Purple</H3>
      <P>
        Used for links, buttons and their respective states like hover, after,
        disabled, etc
      </P>
      <ColorGrid>
        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#EAE2F8' }} />
          <H3Bold>#EAE2F8</H3Bold>
          <P>Purple - 50</P>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#CFBCF2' }} />
          <H3Bold>#CFBCF2</H3Bold>
          <P>Purple - 100</P>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#A081D9' }} />
          <H3Bold>#A081D9</H3Bold>
          <P>Purple - 200</P>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#8663C7' }} />
          <H3Bold>#8663C7</H3Bold>
          <P>Purple - 300</P>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#724BB7' }} />
          <H3Bold>#724BB7</H3Bold>
          <P>Purple - 400</P>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#653CAD' }} />
          <H3Bold>#653CAD</H3Bold>
          <P>Purple - 500 Primary</P>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#51279B' }} />
          <H3Bold>#51279B</H3Bold>
          <P>Purple - 600</P>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#421987' }} />
          <H3Bold>#421987</H3Bold>
          <P>Purple - 700</P>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#34126F' }} />
          <H3Bold>#34126F</H3Bold>
          <P>Purple - 800</P>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#240754' }} />
          <H3Bold>#240754</H3Bold>
          <P>Purple - 900</P>
        </ColorContainer>
      </ColorGrid>

      <Divider />
      <H3>Annoying Orange</H3>
      <P>Used for illustrations and tutorial / onboarding components</P>
      <ColorGrid>
        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#FFE8D9' }} />
          <H3Bold>#FFE8D9</H3Bold>
          <P>Orange - 50</P>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#FFD0B5' }} />
          <H3Bold>#FFD0B5</H3Bold>
          <P>Orange - 100</P>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#FFB088' }} />
          <H3Bold>#FFB088</H3Bold>
          <P>Orange - 200</P>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#FF9466' }} />
          <H3Bold>#FF9466</H3Bold>
          <P>Orange - 300</P>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#F9703E' }} />
          <H3Bold>#F9703E</H3Bold>
          <P>Orange - 400</P>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#F35627' }} />
          <H3Bold>#F35627</H3Bold>
          <P>Orange - 500 Primary</P>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#DE3A11' }} />
          <H3Bold>#DE3A11</H3Bold>
          <P>Orange - 600</P>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#C52707' }} />
          <H3Bold>#C52707</H3Bold>
          <P>Orange - 700</P>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#AD1D06' }} />
          <H3Bold>#AD1D06</H3Bold>
          <P>Orange - 800</P>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#841003' }} />
          <H3Bold>#841003</H3Bold>
          <P>Orange - 900</P>
        </ColorContainer>
      </ColorGrid>

      <Divider />
      <H3>Gilded Grays</H3>
      <P>Used for drop shadows and background elements like dividers</P>
      <ColorGrid>
        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#F7F7F7' }} />
          <H3Bold>#F7F7F7</H3Bold>
          <P>Gray - 50</P>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#E1E1E1' }} />
          <H3Bold>#E1E1E1</H3Bold>
          <P>Gray - 100</P>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#CFCFCF' }} />
          <H3Bold>#CFCFCF</H3Bold>
          <P>Gray - 200</P>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#B1B1B1' }} />
          <H3Bold>#B1B1B1</H3Bold>
          <P>Gray - 300</P>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#9E9E9E' }} />
          <H3Bold>#9E9E9E</H3Bold>
          <P>Gray - 400</P>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#7E7E7E' }} />
          <H3Bold>#7E7E7E</H3Bold>
          <P>Gray - 500 Primary</P>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#626262' }} />
          <H3Bold>#626262</H3Bold>
          <P>Gray - 600</P>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#515151' }} />
          <H3Bold>#515151</H3Bold>
          <P>Gray - 700</P>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#3B3B3B' }} />
          <H3Bold>#3B3B3B</H3Bold>
          <P>Gray - 800</P>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#222222' }} />
          <H3Bold>#222222</H3Bold>
          <P>Gray - 900</P>
        </ColorContainer>
      </ColorGrid>
    </StoryIntroContainer>
  ))
  .add('Grids', () => (
    <StoryIntroContainer>
      <H1>Grid System Guide</H1>  <br />
      <H4>
        Most of the Voluntarily Platform fits within a 1280-pixel wide container
        that scales down on mobile.
        <br /> This is inspired by the{' '}
        <a href='https://bbc.github.io/gel-grid/'>BBC GEL Grid system</a>, but
        isn't as strict or comprehensive...   Yet.
      </H4>
      <br />
      <Divider />
      <TestWidthItem />
      <Divider />
      <H4>
       Our default grid uses a 4 column track as well, and this scales down based on available width.
      </H4>
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
const TextH1Text = '<H1>I am a h1 heading</H1>'
const SubtitleText = '<H4>I am subtitle text</H4>'
const TextH4Text = '<H3>I am H3 Text</H3>'
const TextH4BoldText = '<H3Bold>I am H3 Text Bold</H3Bold>'
const TextH4BlackText = '<H3Black>I am H3 Text Black</H3Black>'
const TextPBoldText = '<PBold>I am P Text</PBold>'
const TextPText = '<P>I am P Text</P>'
const TextQuoteA =
  '<BigQuote>  &ldquo; Super-inspirational quote &rdquo;  </BigQuote>'
const TextQuoteB =
  '<BigQuoteAuthor>  -Rando Inspirational person  </BigQuoteAuthor>'
