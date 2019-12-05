import React, { Component } from 'react'
import publicPage from '../../hocs/publicPage'
import Hero from '../../components/LandingPageComponents/Hero'
import PersonaSection from '../../components/LandingPageComponents/PersonaSection'
import OpListSection from '../../components/Op/OpListSection'
import OpAdd from '../../components/Op/OpAdd'
import TitleSection from '../../components/LandingPageComponents/TitleSection'
import { FullPage } from '../../components/VTheme/VTheme'
// import bigimage from './landing-page-bg.jpg'
// import schoolsactivity from './schoolsactivity.png'
import { Helmet } from 'react-helmet'

class Landing extends Component {
  render () {
    return (
      <div>
        <Hero />
        <FullPage>
          <Helmet>
            <title>Voluntarily</title>
          </Helmet>
          <TitleSection
            title='Who we help'

          />
          <PersonaSection />
          <TitleSection
            title='Happening Soon'

          />

          <OpListSection store={this.props.store} filter={{ date: '' }} />
          <OpAdd {...this.props} />
        </FullPage>
      </div>
    )
  }
}
export const LandingTest = Landing // for test
export default publicPage(Landing)
