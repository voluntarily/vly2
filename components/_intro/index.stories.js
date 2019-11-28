import { storiesOf } from '@storybook/react'
import { Divider } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { ColorContainer, ColorGrid, ColorSwatch, StoryIntroContainer } from '../VTheme/VStoryTheme'
import { BigQuote, BigQuoteAuthor, Grid, h1, H3, H3Black, H3Bold, h4, p, PBold, TextBigTitle } from '../VTheme/VTheme'

storiesOf('Welcome', module)
  .add('Getting Started', () => (
    <StoryIntroContainer>
      <h1> 🥳 Welcome 🥳</h1>
      <h4>This is the Voluntarily Component Library </h4>
      <Divider />
      <h4>All frontend development for the Voluntarily Platform starts here. Browse the components we use on the left, and tinker with them here without the risk of breaking anything 😂<br /> Open-Sauce (or Open Source) contributions are welcome, and enjoy yourself while you're here :) <br /><br />
        <li><a href='https://github.com/voluntarily/vly2' target='_blank' rel='noopener noreferrer'> 🎒 See the repo here</a></li>
        <li><a href='https://github.com/voluntarily/vly2/blob/master/docs/gettingstarted.md' target='_blank' rel='noopener noreferrer'>💻 Get Started with Windows, Mac, or Linux</a></li>

      </h4>

    </StoryIntroContainer>
  ))
  .add('Typography', () => (
    <StoryIntroContainer>
      <h1>Text Styles</h1>
      <h4>How we do text and typography on the platform</h4>
      <Divider />
      <h4>Hero Title Text</h4>
      <TextBigTitle>I am a hero title.</TextBigTitle>
      <PBold>Notes</PBold>
      <p>
        I only get used on the landing and marketing pages atm. Use me very
        sparringly.
      </p>
      <br />
      <PBold>Code</PBold>
      <code>{TextHeroText}</code>
      <Divider />
      <h4>h1 Text - Page Titles</h4>
      <h1>I am a h1 heading.</h1>
      <PBold>Notes</PBold>
      <p>
        I am used on page titles
      </p>
      <br />
      <PBold>Code</PBold>
      <code>{TextH1Text}</code>
      <Divider />
      <h4>H3 Text Heading Black</h4> <br />
      <H3Black>I am a H3 Text Heading Black</H3Black>
      <br />
      <PBold>Notes</PBold>
      <p>
        I usually get used on component titles ie: a card set on the landing page  or list of recommendations in your dash
      </p>
      <br />
      <PBold>Code</PBold>
      <code>{TextH4BlackText}</code>
      <Divider />
      <h4>H3 Text Heading Bold</h4> <br />
      <H3Bold>I am a H3 Text Heading Bold</H3Bold>
      <br />
      <PBold>Code</PBold>
      <code>{TextH4BoldText}</code>
      <Divider />
      <h4>H3 Text Heading</h4> <br />
      <H3>I am a H3 Text Heading</H3>
      <br />
      <PBold>Code</PBold>
      <code>{TextH4Text}</code>
      <Divider />
      <h4>h4</h4>
      <h4>
        I am h4 subtitle text usually used underneath h1 and hero title text
      </h4>
      <br />
      <PBold>Code</PBold>
      <code>{SubtitleText}</code>
      <Divider />
      <h4>p Bold Body Text</h4> <br />
      <PBold>
        I am p Bold Body Text. Benchmarking, say/do ratio, benchmarking, EBITDA
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
      <h4>p Body Text</h4> <br />
      <p>
        I am p Body Text. Benchmarking, say/do ratio, benchmarking, EBITDA - all
        are competing for the attention of stakeholders. Going forward, the key
        to enterprise content management is recalibration. The critical and
        fast-evolving quality control strengthens the Chief Digital Officer. In
        the future, we look forward to working together to manage the balance.
        Value propositions challenge us to benchmark the portfolio. The
        hybridation credibly influences the disruptors ensuring a solid
        profitability.
      </p>
      <br />
      <PBold>Code</PBold>
      <code>{TextPText}</code>
      <Divider />
      <h4>Quote Block</h4> <br />
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
      <h1>Color Guide</h1>
      <h4>
        These are the color palettes that we use on the Voluntarily platform.
        Inspired by Material Design
      </h4>
      <Divider />
      <H3>Primary Colors</H3>
      <ColorGrid>
        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#653CAD' }} />
          <H3Bold>#653CAD</H3Bold>
          <p>
            Purple - for links, buttons and all things clicky. Use me sparingly.
          </p>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#F35627' }} />
          <H3Bold>#F35627</H3Bold>
          <p>Orange - for illustrations and guides</p>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#222222' }} />
          <H3Bold>#222222</H3Bold>
          <p>Grays - for drop shadows and splitter components</p>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#F44336' }} />
          <H3Bold>#F44336</H3Bold>
          <p>
            Red - for Alerts and when things to terribly wrong - Use me
            sparingly.
          </p>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#36F482' }} />
          <H3Bold>#36F482</H3Bold>
          <p>
            Green - for success states and checks in lists - Use me sparingly.
          </p>
        </ColorContainer>
      </ColorGrid>

      <Divider />
      <H3>Text Colors</H3>
      <ColorGrid>
        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#000000' }} />
          <H3Bold>#000000</H3Bold>
          <p>Black - used for most text</p>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#222222' }} />
          <H3Bold>#222222</H3Bold>
          <p>Gray - used for secondary text</p>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch
            style={{ backgroundColor: '#ffffff', border: '1px solid grey' }}
          />
          <H3Bold>#ffffff</H3Bold>
          <p>White - used for button text</p>
        </ColorContainer>
      </ColorGrid>

      <Divider />
      <H3>Awesomesauce Purple</H3>
      <p>
        Used for links, buttons and their respective states like hover, after,
        disabled, etc
      </p>
      <ColorGrid>
        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#EAE2F8' }} />
          <H3Bold>#EAE2F8</H3Bold>
          <p>Purple - 50</p>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#CFBCF2' }} />
          <H3Bold>#CFBCF2</H3Bold>
          <p>Purple - 100</p>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#A081D9' }} />
          <H3Bold>#A081D9</H3Bold>
          <p>Purple - 200</p>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#8663C7' }} />
          <H3Bold>#8663C7</H3Bold>
          <p>Purple - 300</p>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#724BB7' }} />
          <H3Bold>#724BB7</H3Bold>
          <p>Purple - 400</p>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#653CAD' }} />
          <H3Bold>#653CAD</H3Bold>
          <p>Purple - 500 Primary</p>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#51279B' }} />
          <H3Bold>#51279B</H3Bold>
          <p>Purple - 600</p>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#421987' }} />
          <H3Bold>#421987</H3Bold>
          <p>Purple - 700</p>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#34126F' }} />
          <H3Bold>#34126F</H3Bold>
          <p>Purple - 800</p>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#240754' }} />
          <H3Bold>#240754</H3Bold>
          <p>Purple - 900</p>
        </ColorContainer>
      </ColorGrid>

      <Divider />
      <H3>Annoying Orange</H3>
      <p>Used for illustrations and tutorial / onboarding components</p>
      <ColorGrid>
        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#FFE8D9' }} />
          <H3Bold>#FFE8D9</H3Bold>
          <p>Orange - 50</p>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#FFD0B5' }} />
          <H3Bold>#FFD0B5</H3Bold>
          <p>Orange - 100</p>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#FFB088' }} />
          <H3Bold>#FFB088</H3Bold>
          <p>Orange - 200</p>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#FF9466' }} />
          <H3Bold>#FF9466</H3Bold>
          <p>Orange - 300</p>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#F9703E' }} />
          <H3Bold>#F9703E</H3Bold>
          <p>Orange - 400</p>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#F35627' }} />
          <H3Bold>#F35627</H3Bold>
          <p>Orange - 500 Primary</p>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#DE3A11' }} />
          <H3Bold>#DE3A11</H3Bold>
          <p>Orange - 600</p>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#C52707' }} />
          <H3Bold>#C52707</H3Bold>
          <p>Orange - 700</p>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#AD1D06' }} />
          <H3Bold>#AD1D06</H3Bold>
          <p>Orange - 800</p>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#841003' }} />
          <H3Bold>#841003</H3Bold>
          <p>Orange - 900</p>
        </ColorContainer>
      </ColorGrid>

      <Divider />
      <H3>Gilded Grays</H3>
      <p>Used for drop shadows and background elements like dividers</p>
      <ColorGrid>
        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#F7F7F7' }} />
          <H3Bold>#F7F7F7</H3Bold>
          <p>Gray - 50</p>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#E1E1E1' }} />
          <H3Bold>#E1E1E1</H3Bold>
          <p>Gray - 100</p>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#CFCFCF' }} />
          <H3Bold>#CFCFCF</H3Bold>
          <p>Gray - 200</p>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#B1B1B1' }} />
          <H3Bold>#B1B1B1</H3Bold>
          <p>Gray - 300</p>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#9E9E9E' }} />
          <H3Bold>#9E9E9E</H3Bold>
          <p>Gray - 400</p>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#7E7E7E' }} />
          <H3Bold>#7E7E7E</H3Bold>
          <p>Gray - 500 Primary</p>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#626262' }} />
          <H3Bold>#626262</H3Bold>
          <p>Gray - 600</p>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#515151' }} />
          <H3Bold>#515151</H3Bold>
          <p>Gray - 700</p>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#3B3B3B' }} />
          <H3Bold>#3B3B3B</H3Bold>
          <p>Gray - 800</p>
        </ColorContainer>

        <ColorContainer>
          <ColorSwatch style={{ backgroundColor: '#222222' }} />
          <H3Bold>#222222</H3Bold>
          <p>Gray - 900</p>
        </ColorContainer>
      </ColorGrid>
    </StoryIntroContainer>
  ))
  .add('Grids', () => (
    <StoryIntroContainer>
      <h1>Grid System Guide</h1>  <br />
      <h4>
        Most of the Voluntarily Platform fits within a 1280-pixel wide container
        that scales down on mobile.
        <br /> This is inspired by the{' '}
        <a href='https://bbc.github.io/gel-grid/'>BBC GEL Grid system</a>, but
        isn't as strict or comprehensive...   Yet.
      </h4>
      <br />
      <Divider />
      <TestWidthItem />
      <Divider />
      <h4>
        Our default grid uses a 4 column track as well, and this scales down based on available width.
      </h4>
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
const TextH1Text = '<h1>I am a h1 heading</h1>'
const SubtitleText = '<h4>I am subtitle text</h4>'
const TextH4Text = '<H3>I am H3 Text</H3>'
const TextH4BoldText = '<H3Bold>I am H3 Text Bold</H3Bold>'
const TextH4BlackText = '<H3Black>I am H3 Text Black</H3Black>'
const TextPBoldText = '<PBold>I am p Text</PBold>'
const TextPText = '<p>I am p Text</p>'
const TextQuoteA =
  '<BigQuote>  &ldquo; Super-inspirational quote &rdquo;  </BigQuote>'
const TextQuoteB =
  '<BigQuoteAuthor>  -Rando Inspirational person  </BigQuoteAuthor>'
