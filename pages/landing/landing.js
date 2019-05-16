import { Button, Col, Input, Row } from 'antd'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import Link from 'next/link'
import publicPage, { FullPage } from '../../hocs/publicPage'
import Hero from '../../components/HeroPage/Hero'
// import OpListSection from '../../components/Op/OpListSection'
import OpListSection from '../../components/Op/OpListSection'

// import bigimage from './landing-page-bg.jpg'

// import schoolsactivity from './schoolsactivity.png'



export class Landing extends Component {
  render () {
    return (
      <FullPage>
                <Hero />
      
        

          <section>
            <Row gutter={32}>
              <Col span={12}>
                <h2>
                  <FormattedMessage
                    id='SupportUs'
                    defaultMessage='Support Innovation in the classroom.'
                    description='Sub heading for the call to action section of the landing page'
                  />
                </h2>
                <p>
                  <FormattedMessage
                    id='AboutUs'
                    // eslint-disable-next-line max-len
                    defaultMessage='Voluntarily is a platform that connects you with classrooms to teach science, technology, engineering, entrepreneurship, arts and design with the help of engaging content supplied by New Zealand’s leading innovators in educational content. '
                    description='body text of the about Voluntarily section.'
                  />
                </p>
                <Button type='primary' shape='round' size='large' href='/about' >
                  <FormattedMessage
                    id='LearnMore'
                    defaultMessage='Learn More'
                    description='Action button to learn more about Voluntari.ly'
                  />
                </Button>

              </Col>
              <Col span={12} >
                {/* <img src={schoolsactivity} alt='About' /> */}
                <img src='/static/img/schoolsactivity.png' alt='About' />
              </Col>
            </Row>
          </section>
          <section>
            <h2>
              <FormattedMessage
                id='UpcomingOpportunities'
                defaultMessage='Happening soon'
                description='Section title on landing page before list of opportunities'
              />
            </h2>
            <OpListSection store={this.props.store} />
            <Link href={'/op/new'} >
              <Button type='primary' shape='round' >
                <FormattedMessage id='landing.newOp' defaultMessage='New Opportunity' description='Button to create a new opportunity on Landing page' />
              </Button>
            </Link>
          </section>


        </FullPage>
    )
  }
}

export default publicPage(Landing)
