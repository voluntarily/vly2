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
import GiveSupportSection from '../../components/LandingPageComponents/GiveSupportSection'
import TakeSupportSection from '../../components/LandingPageComponents/TakeSupportSection'
export const Landing = ({ isAuthenticated }) => (
  <>
    <Helmet>
      <title>Voluntarily</title>
    </Helmet>

    <Hero
      isAuthenticated={isAuthenticated}
    />

    <FullPage>
      <OfferSection />
      <Divider />
      <GiveSupportSection />
      <Divider />
      <TakeSupportSection />
      {/*
      <OpListSection
        store={props.store}
        filter={{
          date: [moment().subtract(1, 'days'), moment().add(60, 'days')]
        }}
      /> */}

    </FullPage>
  </>
)
export default publicPage(Landing)
