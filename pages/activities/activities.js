import { Button } from 'antd'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import Link from 'next/link'

import publicPage, { FullPage } from '../../hocs/publicPage'
import Hero from '../../components/LandingPageComponents/Hero'
import PersonaSection from '../../components/LandingPageComponents/PersonaSection'
import OpListSection from '../../components/Op/OpListSection'
import TitleSectionSub from '../../components/LandingPageComponents/TitleSectionSub'
import PageHeader from '../../components/Header/PageHeader'
import { Spacer } from '../../components/VTheme/VTheme'
import FeaturedTwoSection from '../../components/LandingPageComponents/FeaturedTwoSection';

// import bigimage from './landing-page-bg.jpg'

// import schoolsactivity from './schoolsactivity.png'

export class Activities extends Component {
  render () {
    return (
      <FullPage>
        <Spacer />
        <PageHeader />
        <FeaturedTwoSection />

        <div className='spacer' />
 
        <OpListSection />
      </FullPage>
    )
  }
}

export default publicPage(Activities)
