import React, { Component } from 'react'

import publicPage, { FullPage } from '../../hocs/publicPage'

import OpListSection from '../../components/Op/OpListSection'
import TitleSectionSub from '../../components/LandingPageComponents/TitleSectionSub'
import PageHeader from '../../components/Header/PageHeader'
import { Spacer } from '../../components/VTheme/VTheme'
import FeaturedTwoSection from '../../components/LandingPageComponents/FeaturedTwoSection'
import BigSearch from '../../components/VTheme/BigSearch'

// import bigimage from './landing-page-bg.jpg'

// import schoolsactivity from './schoolsactivity.png'

export class Activities extends Component {
  render () {
    return (
      <FullPage>
        <Spacer />
        <PageHeader />
        <Spacer />
        <BigSearch />
        {/* // @TODO: [VP-187] Add real data to Upcoming Events component */}
        <FeaturedTwoSection
          title='Your Upcoming Activities'
          subtitle='These activities are happening soon'
        />

        <div className='spacer' />

        {/* @TODO: [VP-188] Add past listings filter to OpListSection */}
        <TitleSectionSub
          title='Your Past Activities'
          subtitle='LOL subtitles'

        />
        <OpListSection />
      </FullPage>
    )
  }
}

export default publicPage(Activities)
