import React, { Component } from 'react'
import publicPage from '../../hocs/publicPage'
import Hero from '../../components/LandingPageComponents/Hero'
import PersonaSection from '../../components/LandingPageComponents/PersonaSection'
import OpListSection from '../../components/Op/OpListSection'
import OpAdd from '../../components/Op/OpAdd'
import TitleSectionSub from '../../components/LandingPageComponents/TitleSectionSub'
import { FullPage, Spacer } from '../../components/VTheme/VTheme'
// import bigimage from './landing-page-bg.jpg'
// import schoolsactivity from './schoolsactivity.png'
import { Helmet } from 'react-helmet'
import moment from 'moment'

class Landing extends Component {
  render () {
    // Setting the Landing page to get the next 3 months of opportunities
    const today = moment().startOf('day')
    const monthsToGet = 3
    const futureDate = moment().add(monthsToGet, 'M')
    console.log(today)
    return (
      <div>
        <Hero />
        <FullPage>
          <Helmet>
            <title>Voluntarily - Welcome</title>
          </Helmet>
          <Spacer />
          <div className='spacer' />
          <TitleSectionSub
            title='Who we help'
            subtitle='We help these awesome people accomplish amazing things'
          />
          <PersonaSection />
          <div className='spacer' />
          <TitleSectionSub
            title='Happening Soon'
            subtitle='You are a few clicks away from getting involved with your community'
          />
          <OpListSection
            store={this.props.store}
            filter={{
              date: [
                today,
                futureDate
              ]
            }}
            dateFilterType={'Date Range'}
          />
          <OpAdd {...this.props} />
        </FullPage>
      </div>
    )
  }
}
export const LandingTest = Landing // for test
export default publicPage(Landing)
