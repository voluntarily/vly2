
import React from 'react'

import { Button } from 'antd'
import { HalfGrid, H2, P, StatContainer, ImageContainer, FeatureContainer } from '../VTheme/VTheme'

const TakeSupportSection = () => (
  <>
    <HalfGrid>
      <FeatureContainer>
        <H2>Offer to help people</H2>

        <StatContainer>
          <img src='./static/img/icons/check.svg' />
          <P>Safe — everyone gets ID checked to keep you safe - for groups</P>
          <img src='./static/img/icons/check.svg' />
          <P>Personalised — we connect you with local people, for an activity at a time that suits</P>
          <img src='./static/img/icons/check.svg' />
          <P>Recognition and support — we help you through the process, and celebrate success</P>
        </StatContainer>
        <Button
          type='primary'
          shape='round'
          size='large'
          href='/acts/type/offer'
          style={{ marginRight: '1rem' }}

        >Offer to help
        </Button>
        <Button
          type='secondary'
          shape='round'
          size='large'
          href='https://blog.voluntarily.nz/contact-us'
        >Join as a business
        </Button>
      </FeatureContainer>
      <ImageContainer src='/static/img/about/offer.png' />

    </HalfGrid>
    {/* <Divider />
    <TitleContainerMid><H2>People are asking for help with...</H2></TitleContainerMid>
    <TripleGrid>
      <a>
        <PromoCard>
          <img src='https://picsum.photos/400/240' />
          <H5><strong>Get help with Remote Work</strong></H5>
          <H5>45 people offering to help you</H5>
        </PromoCard>
      </a>
      <a>
        <PromoCard>
          <img src='https://picsum.photos/400/240' />
          <H5><strong>Get help with Remote Work</strong></H5>
          <H5>45 people offering to help you</H5>
        </PromoCard>
      </a>
      <a>
        <PromoCard>
          <img src='https://picsum.photos/400/240' />
          <H5><strong>Get help with Remote Work</strong></H5>
          <H5>45 people offering to help you</H5>
        </PromoCard>
      </a>

    </TripleGrid>
    <TitleContainerMid>
      <Button
        type='secondary'
        shape='round'
        size='large'
        href='https://blog.voluntarily.nz'
      >See all offers
      </Button>
    </TitleContainerMid> */}
  </>
)
export default TakeSupportSection
