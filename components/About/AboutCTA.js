import TitleSectionSub from '../LandingPageComponents/TitleSectionSub'
import styled from 'styled-components'
import { Button } from 'antd'

import { TripleGrid } from '../VTheme/VTheme'

// cardcontainer
const CTAContainer = styled.div`
  width: 25rem;

  @media screen and (max-width: 767px) {
    width: calc(100vw - 2rem);
    margin-bottom: 2rem;
  }
`

// cardimg
const CTAImage = styled.img`
  width: 100%;
  height: 10rem;
  background-color: black;
  object-fit: cover;
  object-position: center;
  @media screen and (max-width: 767px) {
    width: calc(100vw - 2rem);
    margin-right: 0;
  }
`
// cardtitle
const CTATitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #000000;
  letter-spacing: -0.8px;
  line-height: 40px;
  margin-bottom: 0;
  @media screen and (max-width: 767px) {
    width: calc(100vw - 2rem);
    margin-right: 0;
  }
`
// cardabout
const CTADescription = styled.h1`
  font-size: 1rem;
  line-height: 24px;
  font-weight: 400;
  letter-spacing: -0.3px;
  @media screen and (max-width: 767px) {
    width: calc(100vw - 2rem);
    margin-right: 0;
  }
`

const AboutCTA = () => (
  <div>
    <TitleSectionSub title='How to get involved' />
    <TripleGrid>
      <CTAContainer>
        <CTAImage src='../../static/img/about/dev.png' />
        <CTATitle>Developers</CTATitle>
        <CTADescription>
          Keen to join the build of the platform? Find us on Github and Gitter.
          All skill levels are welcome.
        </CTADescription>
        <Button href='https://gitter.im/voluntarily/community' target='_blank'>
          Dev Chatroom
        </Button>
        <Button href='https://github.com/voluntarily/vly2' target='_blank'>
          {' '}
          Github Repository
        </Button>
      </CTAContainer>
      <CTAContainer>
        <CTAImage src='../../static/img/about/volunteers.png' />
        <CTATitle>Volunteers</CTATitle>
        <CTADescription>
          If you’re keen to get involved in volunteer operations and help run
          things, join the channel on Gitter.
        </CTADescription>
        <Button href='https://gitter.im/voluntarily/Volunteers' target='_blank'>
          Volunteer Operations Chatroom
        </Button>
      </CTAContainer>
      <CTAContainer>
        <CTAImage src='../../static/img/about/sponsors.png' />
        <CTATitle>Sponsors</CTATitle>
        <CTADescription>
          Donations and long term support help speed up the development of the
          voluntarily platform and be more effective in the lives of young
          Kiwis.
        </CTADescription>
        <Button
          href='https://secure.squarespace.com/checkout/donate?donatePageId=5becd3d770a6adb0fa3e7b28'
          target='_blank'
        >
          Donate
        </Button>
      </CTAContainer>
    </TripleGrid>
  </div>
)

export default AboutCTA
