
import React from 'react'

import { Button, Divider } from 'antd'
import { HalfGrid, TripleGrid, H2, H3, P, StatContainer, PromoCard, H5, TitleContainerMid, ImageContainer } from '../VTheme/VTheme'

const GiveContentSection = () => (
  <>
    <HalfGrid>

      <ImageContainer src='/static/img/about/content.png' />

      <div>
        <H2>Content &amp; Programmes</H2>
        <H3>Skilled volunteers are offering to help you out. We get all the admin and annoying stuff out of the way to give you more time</H3>

        <StatContainer>
          <img src='./static/img/icons/check.svg' />
          <P>Safe — everyone gets ID checked to keep you safe - for groups</P>
          <img src='./static/img/icons/check.svg' />
          <P>Personalised — we connect you with local people, for an activity at a time that suits</P>
          <img src='./static/img/icons/check.svg' />
          <P>Recognition and support — we help you through the process, and celebrate success</P>
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
    </HalfGrid>
    <Divider />
    <TitleContainerMid><H2>Supporting groups on voluntarily</H2></TitleContainerMid>
    <TripleGrid>
      <a>
        <PromoCard>
          <img src='https://picsum.photos/400/240' />
          <div>
            <H5><strong>Get help with Remote Work</strong></H5>
            <H5><a>45 people offering to help you</a></H5>
          </div>
        </PromoCard>
      </a>
      <a>
        <PromoCard>
          <img src='https://picsum.photos/400/240' />
          <div>
            <H5><strong>Get help with Remote Work</strong></H5>
            <H5><a>45 people offering to help you</a></H5>
          </div>
        </PromoCard>
      </a>
      <a>
        <PromoCard>
          <img src='https://picsum.photos/400/240' />
          <H5><strong>Get help with Remote Work</strong></H5>
          <H5><a>45 people offering to help you</a></H5>
        </PromoCard>
      </a>

    </TripleGrid>
    <TitleContainerMid>
      <Button
        type='secondary'
        shape='round'
        size='large'
        href='https://blog.voluntarily.nz'
      >See more offers from your community
      </Button>
    </TitleContainerMid>
  </>
)
export default GiveContentSection
