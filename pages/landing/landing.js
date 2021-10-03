import React from 'react'
import Head from 'next/head'
import Hero from '../../components/LandingPageComponents/Hero'
// import OfferSection from '../../components/LandingPageComponents/OfferSection'
// import OpAdd from '../../components/Op/OpAdd'
// import OpListSection from '../../components/Op/OpListSection'
import { FullPage } from '../../components/VTheme/VTheme'
// import moment from 'moment'
import { Divider } from 'antd'
import HowSection from '../../components/LandingPageComponents/HowSection'

import GiveSupportSection from '../../components/LandingPageComponents/GiveSupportSection'

import TakeSupportSection from '../../components/LandingPageComponents/TakeSupportSection'
// import Testimonial from '../../components/LandingPageComponents/Testimonial'
// import CorporateSection from '../../components/LandingPageComponents/CorporateSection'
// import GiveContentSection from '../../components/LandingPageComponents/GiveContentSection'
// import HelpSocialSection from '../../components/LandingPageComponents/HelpSocialSection'
// import HelpOrgsSection from '../../components/LandingPageComponents/HelpOrgsSection'
import Sponsors from '../../components/LandingPageComponents/Sponsors'
import WhoSection from '../../components/LandingPageComponents/WhoSection'
export const Landing = ({ isAuthenticated }) => (
  <>
    <Head>
      <title>Voluntarily</title>
    </Head>

    <Hero
      isAuthenticated={isAuthenticated}
    />

    <FullPage>
      <Divider />
      <WhoSection />
      <Divider />
      <HowSection />

      <>
        <Sponsors />
        {/* <Testimonial /> */}
        <Divider />

        <GiveSupportSection />
        <Divider />
        <TakeSupportSection />
        <Divider />
        {/* <OfferSection /> */}
        {/* <Divider />
        <CorporateSection />
        <Divider />
        <HelpOrgsSection />
        <Divider />
        <HelpSocialSection />

        <Divider />
        <GiveContentSection /> */}
      </>
    </FullPage>
  </>
)
export default Landing
