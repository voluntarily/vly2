import TitleSectionSub from '../LandingPageComponents/TitleSectionSub'
import styled from 'styled-components'
import { Button } from 'antd'

import { FormattedMessage } from 'react-intl'
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
        <CTATitle>
          <FormattedMessage 
            id="cta.title.dev" 
            description="title for call to action for developers" 
            defaultMessage="Developers"
          />
        </CTATitle>
        <CTADescription>
          <FormattedMessage 
            id="cta.description.dev" 
            description="description of call to action for developers" 
            defaultMessage="Keen to join the build of the platform? Find us on Github and Gitter. All skill levels are welcome."
          />
        </CTADescription>
        <Button href='https://gitter.im/voluntarily/community' target='_blank'>
          <FormattedMessage 
            id="cta.dev.chat" 
            description="call to action for developers to enter the chatroom" 
            defaultMessage="Dev Chatroom"
          />
        </Button>&nbsp;&nbsp;
        <Button href='https://github.com/voluntarily/vly2' target='_blank'>
          {' '}
            <FormattedMessage 
            id="cta.dev.repository" 
            description="call to action for developers to view the repository" 
            defaultMessage="Github Repository"
          />
        </Button>
      </CTAContainer>
      <CTAContainer>
        <CTAImage src='../../static/img/about/volunteers.png' />
        <CTATitle>
          <FormattedMessage 
            id="cta.title.volunteer" 
            description="title for call to action for volunteers" 
            defaultMessage="Volunteers"
          />
        </CTATitle>
        <CTADescription>
          <FormattedMessage 
            id="cta.description.volunteer" 
            description="description of call to action for volunteers" 
            defaultMessage="If you’re keen to get involved in volunteer operations and help run
          things, join the channel on Gitter."
          />
        </CTADescription>
        <Button href='https://gitter.im/voluntarily/Volunteers' target='_blank'>
          <FormattedMessage 
            id="cta.volunteer.chat" 
            description="call to action for volunteers to enter the chatroom" 
            defaultMessage="Volunteer Operations Chatroom"
          />
        </Button>
      </CTAContainer>
      <CTAContainer>
        <CTAImage src='../../static/img/about/sponsors.png' />
        <CTATitle>
          <FormattedMessage 
            id="cta.title.sponsor" 
            description="title for call to action for sponsors" 
            defaultMessage="Sponsors"
          />
        </CTATitle>
        <CTADescription>
          <FormattedMessage 
            id="cta.description.sponsor" 
            description="description of call to action for sponsors" 
            defaultMessage="Donations and long term support help speed up the development of the voluntarily platform and be more effective in the lives of young Kiwis."
          />
        </CTADescription>
        <Button
          href='https://secure.squarespace.com/checkout/donate?donatePageId=5becd3d770a6adb0fa3e7b28'
          target='_blank'
        >
          <FormattedMessage 
            id="cta.sponsor.donate" 
            description="call to action for sponsors to donate" 
            defaultMessage="Donate"
          />
        </Button>
      </CTAContainer>
    </TripleGrid>
  </div>
)

export default AboutCTA
