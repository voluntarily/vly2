import React from 'react'
import { Helmet } from 'react-helmet'
import Hero from '../../components/LandingPageComponents/Hero'
import OfferSection from '../../components/LandingPageComponents/OfferSection'
// import OpAdd from '../../components/Op/OpAdd'
// import OpListSection from '../../components/Op/OpListSection'
import { FullPage } from '../../components/VTheme/VTheme'
import publicPage from '../../hocs/publicPage'
// import moment from 'moment'
import { Divider } from 'antd'

import CorporateSection from '../../components/LandingPageComponents/CorporateSection'
import GiveSupportSection from '../../components/LandingPageComponents/GiveSupportSection'

import GiveContentSection from '../../components/LandingPageComponents/GiveContentSection'
import TakeSupportSection from '../../components/LandingPageComponents/TakeSupportSection'
import HowSection from '../../components/LandingPageComponents/HowSection'
import Testimonial from '../../components/LandingPageComponents/Testimonial'
import HelpSocialSection from '../../components/LandingPageComponents/HelpSocialSection'
import HelpOrgsSection from '../../components/LandingPageComponents/HelpOrgsSection'
export const Landing = ({ isAuthenticated }) => (
  <>
    <Helmet>
      <title>Voluntarily</title>
    </Helmet>

    <Hero
      isAuthenticated={isAuthenticated}
    />

    <FullPage style={{ marginTop: '0' }}>
      <OfferSection />
      <Divider />
      <HowSection />
      <Divider />
      <Testimonial />
      <Divider />
      <GiveSupportSection />
      <Divider />
      <TakeSupportSection />
      <Divider />
      <CorporateSection />
      <Divider />
      <HelpSocialSection />
      <Divider />
      <HelpOrgsSection />
      <Divider />
      <GiveContentSection />

    </FullPage>
  </>
)
export default publicPage(Landing)
