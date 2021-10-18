import { storiesOf } from '@storybook/react'
import { Divider } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { StoryIntroContainer } from '../VTheme/VStoryTheme'
import { Grid, TripleGrid } from '../VTheme/VTheme'

storiesOf('Grids & Layouts', module)

  .add('Standard 4 column grid', () => (
    <StoryIntroContainer>
      <h1>Grid Overview</h1>  <br />
      <h4>
        Most of the Voluntarily Platform fits within a 1280-pixel wide container
        that scales down on mobile.
        <br /> This is inspired by the{' '}
        <a href='https://bbc.github.io/gel-grid/'>BBC GEL Grid system</a>, but
        isn&apos;t as strict or comprehensive...   Yet.
      </h4>
      <br />
      <Divider />

      <h4>
        Our default grid uses a 4 column track as well, and this scales down based on available width.
      </h4>
      <br />
      <br />
      <Grid><TestWidthItem /><TestWidthItem /><TestWidthItem /><TestWidthItem /><TestWidthItem /><TestWidthItem /><TestWidthItem /><TestWidthItem /><TestWidthItem /><TestWidthItem /><TestWidthItem /><TestWidthItem /><TestWidthItem /><TestWidthItem /><TestWidthItem /><TestWidthItem /></Grid>

    </StoryIntroContainer>
  ))

  .add('3 column grids', () => (
    <StoryIntroContainer>
      <h1>Triple grid example</h1>  <br />

      <h4>
        We currently use this grid on the People admin page and this scales down based on available width.
        <Divider />
      </h4>
      <br />
      <br />
      <TripleGrid><TestWidthItem /><TestWidthItem /><TestWidthItem /><TestWidthItem /><TestWidthItem /><TestWidthItem /><TestWidthItem /><TestWidthItem /></TripleGrid>

    </StoryIntroContainer>
  ))

  .add('3 column grids', () => (
    <StoryIntroContainer>
      <h1>Triple grid example</h1>  <br />

      <h4>
        We currently use this grid on the People admin page and this scales down based on available width.
        <Divider />
      </h4>
      <br />
      <br />
      <TripleGrid><TestWidthItem /><TestWidthItem /><TestWidthItem /><TestWidthItem /><TestWidthItem /><TestWidthItem /><TestWidthItem /><TestWidthItem /></TripleGrid>

    </StoryIntroContainer>
  ))

const TestWidthItem = styled.div`
  height: 10rem;
  max-width: 1280px;
  background-color: purple;


`
