
import React from 'react'

import { Button } from 'antd'
import { HalfGrid, H2, P, StatContainer, ImageContainer, FeatureContainer } from '../VTheme/VTheme'
const GiveSupportSection = () => (
  <>
    <HalfGrid>

      <ImageContainer src='/static/img/about/askforhelp.png' />

      <FeatureContainer>
        <H2>Ask for help from Volunteers</H2>

        <StatContainer>
          <img src='./static/img/icons/check.svg' />
          <P><strong>Everyone gets ID checked</strong> to keep you safe </P>
          <img src='./static/img/icons/check.svg' />
          <P><strong>We connect you with local people</strong>, for an activity at a time that suits</P>
          <img src='./static/img/icons/check.svg' />
          <P><strong>We help you</strong> through the process, and celebrate success</P>
        </StatContainer>
        <Button
          type='primary'
          shape='round'
          size='large'
          href='/a/ask'
          style={{ margin: '1rem 1rem 0 0' }}
        >Ask for help
        </Button>
        <Button
          type='secondary'
          shape='round'
          size='large'
          href='https://blog.voluntarily.nz/contact-us'
        >Join as a community group
        </Button>
      </FeatureContainer>

    </HalfGrid>
    {/* {isNotProd &&
      <>
        <TitleContainerMid><H2>Featured offers from volunteers</H2></TitleContainerMid>
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
            block
            type='secondary'
            shape='round'
            size='large'
            href='https://blog.voluntarily.nz'
          >See more offers
          </Button>
        </TitleContainerMid>
      </>} */}

  </>
)
export default GiveSupportSection
