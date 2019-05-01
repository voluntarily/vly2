import { Button, Col, Input, Row } from 'antd'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'

import Link from 'next/link'
import publicPage, { FullPage } from '../../hocs/publicPage'

// import OpListSection from '../../components/Op/OpListSection'
import OpListSection from '../Ops/OpListSection'
// import bigimage from './landing-page-bg.jpg'
// import styles from './Landing.less'
// import schoolsactivity from './schoolsactivity.png'

import styled from 'styled-components'
const Search = Input.Search
export const Hero = styled.div`

  .hero {
    width: 100%;
    position: relative;
    top:-56px;
    font-size:0.5rem;
    margin: 0;
  }

  @media screen and (min-width: 768px) {
    .hero {
      font-size: 1rem;
    }
  }

  @media screen and (min-width: 1024px) {
    .hero {
      font-size: 1.5rem;
    }
  }
  @media screen and (min-width: 1280px) {
    .hero {
      font-size: 2.0rem;
    }
  }

  /* Full width image */
  .hero img {
    min-height: 100%;
    min-width: 400px;
    width: 100%;
  }

  /* component in centre of image */
  .herocard {
    position: absolute;
    color: #FFFFFF;
    top: 30%;
    left: 8%;
    width:75%;  
  }

  .herocard h1 {
    color: #FFFFFF;
    font-size: 3em;
    font-weight: 900;
    letter-spacing: -0.03em;
    margin-bottom: 0px;
  }

`

export class Landing extends Component {
  render () {
    return (
      <div>
        <Hero className='hero'>
          {/* <img src={bigimage} alt='Welcome' /> */}
          <img src='/static/img/landing-page-bg.jpg' alt='Welcome' />
          <div className='herocard' >
            <h1>
              <FormattedMessage id='BeAwesome' defaultMessage='Become a Volunteer' description='First call to action on the landing page' />
            </h1>
            <p>
              <FormattedMessage
                id='BeAwesomeSub'
                defaultMessage='Volunteer your time to help the next generation of inventors accomplish epic projects.'
                description='Subheading for call to action on the landing page'
              />
            </p>
            <Search
              placeholder="try 'launching rockets' "
              enterButton='Search'
              size='large'
              // eslint-disable-next-line no-console
              onSearch={value => console.log(value)}
            />
            <br /><br />
            <Button type='primary' shape='round' size='large' >
              <FormattedMessage
                id='BrowseRequests'
                defaultMessage='Browse Requests'
                description='Action button on landing page links to list of opportunities'
              />
            </Button>
          </div>
        </Hero>
        <FullPage>
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
            <OpListSection />
            <Link href={'/op/new'} >
              <Button type='primary' shape='round' >
                <FormattedMessage id='newOp' defaultMessage='New Opportunity' description='Button to create a new opportunity on Landing page' />
              </Button>
            </Link>
          </section>
        </FullPage>

      </div>
    )
  }
}

export default publicPage(Landing)
