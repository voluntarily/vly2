import React, { Component } from 'react'

import publicPage, { FullPage } from '../../hocs/publicPage'
import Hero from '../../components/LandingPageComponents/Hero'
import PersonaSection from '../../components/LandingPageComponents/PersonaSection'
import OpListSection from '../../components/Op/OpListSection'
import OpAdd from '../../components/Op/OpAdd'
import TitleSectionSub from '../../components/LandingPageComponents/TitleSectionSub'
import { Spacer } from '../../components/VTheme/VTheme'
// import bigimage from './landing-page-bg.jpg'

// import schoolsactivity from './schoolsactivity.png'

export class Landing extends Component {
  render () {
    return (
      <div>
        <Hero />
        <FullPage>
          <Spacer />
          {/* <AboutSection
            title='Support Innovation in the classroom.'
            subtitle='Voluntarily connects you with classrooms to teach science, technology, engineering, entrepreneurship, arts, and design with the help of engaging content supplied by New Zealand’s leading innovators in educational content.'
          /> */}
          <div className='spacer' />
          <TitleSectionSub
            title='Who we help'
            subtitle='We help these awesome people accomplish amazing things'
          />
          <PersonaSection />
          <div className='spacer' />
          <TitleSectionSub
            title='Happening Soon'
            subtitle='You are two clicks away from getting involved with your community'
          />

          <OpListSection store={this.props.store} />
          <OpAdd {...this.props} />
        </FullPage>
      </div>
    )
  }
}

export default publicPage(Landing)
