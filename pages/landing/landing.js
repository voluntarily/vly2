import { Button } from 'antd'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import Link from 'next/link'
import publicPage, { FullPage } from '../../hocs/publicPage'

import Hero from '../../components/HeroPage/Hero'
import AboutSection from '../../components/HeroPage/AboutSection'
import PersonaSection from '../../components/HeroPage/PersonaSection'
import OpListSection from '../../components/Op/OpListSection'
import TitleSectionSub from '../../components/HeroPage/TitleSectionSub'

// import bigimage from './landing-page-bg.jpg'

// import schoolsactivity from './schoolsactivity.png'

export class Landing extends Component {
  render () {
    return (
      <div>
        <Hero />
        <FullPage>
        <AboutSection
          title='Support Innovation in the classroom.'
          subtitle='Voluntarily connects you with classrooms to teach science, technology, engineering, entrepreneurship, arts, and design with the help of engaging content supplied by New Zealand’s leading innovators in educational content.'
        />
        <div className='spacer' />
        <TitleSectionSub
          title='How we help'
          subtitle='We help these awesome people accomplish amazing things'
        />
        <PersonaSection />
        <div className='spacer' />
        <TitleSectionSub
          title='Happening Soon'
          subtitle='You are two clicks away from getting involved with your community'
        />

        <OpListSection store={this.props.store} />
        <Link href={'/op/new'}>
          <Button type='primary' shape='round'>
            <FormattedMessage
              id='landing.newOp'
              defaultMessage='New Opportunity'
              description='Button to create a new opportunity on Landing page'
            />
          </Button>
        </Link>
      </FullPage>
      </div>
    )
  }
}

export default publicPage(Landing)
