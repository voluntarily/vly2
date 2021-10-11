import React from 'react'
import Head from 'next/head'
import Hero from '../../components/Landing/Hero'
// import OfferSection from '../../components/Landing/OfferSection'
// import OpAdd from '../../components/Op/OpAdd'
// import OpListSection from '../../components/Op/OpListSection'
import { FullPage } from '../../components/VTheme/VTheme'
// import moment from 'moment'
import { Divider } from 'antd'
import HowSection from '../../components/Landing/HowSection'

import GiveSupportSection from '../../components/Landing/GiveSupportSection'

import TakeSupportSection from '../../components/Landing/TakeSupportSection'
// import Testimonial from '../../components/Landing/Testimonial'
// import CorporateSection from '../../components/Landing/CorporateSection'
// import GiveContentSection from '../../components/Landing/GiveContentSection'
// import HelpSocialSection from '../../components/Landing/HelpSocialSection'
// import HelpOrgsSection from '../../components/Landing/HelpOrgsSection'
import Sponsors from '../../components/Landing/Sponsors'
import WhoSection from '../../components/Landing/WhoSection'
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
