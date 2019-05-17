import { Button } from 'antd'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import Link from 'next/link'
import publicPage, { FullPage } from '../../hocs/publicPage'

import Hero from '../../components/HeroPage/Hero'
import AboutSection from '../../components/HeroPage/AboutSection'
import PersonaSection from '../../components/HeroPage/PersonaSection'
import OpListSection from '../../components/Op/OpListSection'
import TitleSection from '../../components/HeroPage/TitleSection'

// import bigimage from './landing-page-bg.jpg'

// import schoolsactivity from './schoolsactivity.png'

export class Landing extends Component {
  render () {
    return (
      <FullPage>
        <Hero />
        <AboutSection
          title='Support Innovation in the classroom.'
          subtitle='Voluntarily is a platform that connects you with classrooms to teach science, technology, engineering, entrepreneurship, arts and design with the help of engaging content supplied by New Zealand’s leading innovators in educational content.'
        />
        <div className='spacer' />
        <TitleSection
          title='How we help'
          subtitle='We help these awesome people accomplish amazing things'
        />
        <PersonaSection />
        <div className='spacer' />
        <TitleSection
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
    )
  }
}

export default publicPage(Landing)
