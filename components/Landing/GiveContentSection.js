
import React from 'react'

import { Button, Image } from 'antd'
import { HalfGrid, H2, H3, P, StatContainer, ImageContainer } from '../VTheme/VTheme'

const GiveContentSection = () => (
  <div id='content'>
    <HalfGrid>

      <div>
        <H2>Content &amp; Programmes</H2>
        <H3>Skilled volunteers are offering to help you out. We get all the admin and annoying stuff out of the way to give you more time</H3>

        <StatContainer>
          <Image alt='' src='/static/img/icons/check.svg' />
          <P>Safe — everyone gets ID checked to keep you safe - for groups</P>
          <Image alt='' src='/static/img/icons/check.svg' />
          <P>Personalised — we connect you with local people, for an activity at a time that suits</P>
          <Image alt='' src='/static/img/icons/check.svg' />
          <P>Recognition and support — we help you through the process, and celebrate success</P>
        </StatContainer>
        <Button
          type='primary'
          shape='round'
          size='large'
          href='https://blog.voluntarily.nz'
          style={{ marginRight: '1rem' }}
        >Learn more
        </Button>

      </div>

      <ImageContainer src='/static/img/about/content.png' />
    </HalfGrid>
  </div>
)
export default GiveContentSection
