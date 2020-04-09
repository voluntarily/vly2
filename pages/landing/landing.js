import React from 'react'
import { Helmet } from 'react-helmet'
import Hero from '../../components/LandingPageComponents/Hero'
import OfferSection from '../../components/LandingPageComponents/OfferSection'
import { FullPage } from '../../components/VTheme/VTheme'
import publicPage from '../../hocs/publicPage'
import { Divider } from 'antd'
import GiveSupportSection from '../../components/LandingPageComponents/GiveSupportSection'
import TakeSupportSection from '../../components/LandingPageComponents/TakeSupportSection'
export const Landing = ({ isAuthenticated }) => (
  <>
    <Helmet>
      <title>Voluntarily — People helping people.</title>
    </Helmet>

    <FullPage>
      <Hero isAuthenticated={isAuthenticated} />
    </FullPage>
    <FullPage>
      <Divider />
      <OfferSection />
      <Divider />
      <GiveSupportSection />
      <Divider />
      <TakeSupportSection />
    </FullPage>
  </>
)
export default publicPage(Landing)
