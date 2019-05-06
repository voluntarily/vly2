import { Button, Col, Input, Row } from 'antd'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'

import Link from 'next/link'
import publicPage, { FullPage } from '../../hocs/publicPage'

// import OpListSection from '../../components/Op/OpListSection'
import OpListSection from '../../components/Op/OpListSection'


// import bigimage from './landing-page-bg.jpg'
 import styles from './Landing.less'
// import schoolsactivity from './schoolsactivity.png'

import styled from 'styled-components'
const Search = Input.Search
// export const Hero = styled.div`

//   .hero {
//     width: 100vw;
//     position: relative;
//     top:-56px;
//     font-size:0.5rem;
//     margin: 0;
//   }

//   @media screen and (min-width: 768px) {
//     .hero {
//       font-size: 1rem;
//     }
//   }

//   @media screen and (min-width: 1024px) {
//     .hero {
//       font-size: 1.5rem;
//     }
//   }
//   @media screen and (min-width: 1280px) {
//     .hero {
//       font-size: 2.0rem;
//     }
//   }

//   /* Full width image */
//   .hero img {
//     min-height: 80vh;
//     min-width: 400px;
//     width: 100%;
//   }

//   /* component in centre of image */
//   .herocard {
//     position: absolute;
//     color: #FFFFFF;
//     top: 30%;
//     left: 8%;
//     width:75%;  
//   }

//   .herocard h1 {
//     color: #FFFFFF;
//     font-size: 3em;
//     font-weight: 900;
//     letter-spacing: -0.03em;
//     margin-bottom: 0px;
//   }

// `

export class Landing extends Component {
  render () {
    return (
      <div>
        <div className='hero'>
          {/* <img src={bigimage} alt='Welcome' /> */}
          <img src='/static/img/landing-page-bg.jpg' alt='Welcome' />
          <div className='herocard' >
            <h1>
              <FormattedMessage id='BeAwesome' defaultMessage='Become a volunteer' description='First call to action on the landing page' />
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
            <Button type='secondary' shape='round' size='large' >
              <FormattedMessage
                id='LearnMuchMore'
                defaultMessage='Learn More'
                description='Learn more about voluntarily'
              />
            </Button>
          </div>
        </div>
        <FullPage>
          <div class="vGridContainer">
          <section>
            <Row gutter={24} type="flex" justify="center">
              <Col span={12}>
                <div class="centeredDiv">
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
                    defaultMessage='Voluntarily connects you with classrooms to teach science, technology, engineering, entrepreneurship, arts and design with the help of engaging content supplied by New Zealand’s leading innovators in educational content. '
                    description='body text of the about Voluntarily section.'
                  />
                </p>
                <br/>
                <Button type='primary' shape='round' size='large' href='/about' >
                  <FormattedMessage
                    id='LearnMore'
                    defaultMessage='Learn More'
                    description='Action button to learn more about Voluntari.ly'
                  />
                </Button>
                </div>
              </Col>
              <Col span={12} >
                {/* <img src={schoolsactivity} alt='About' /> */}
                <img class="aboutImg" src='/static/img/schoolsactivity.png' alt='About' />
              </Col>
            </Row>
          </section>
          <div class="spacer"></div>
          <section>
            <h2>
              <FormattedMessage
                id='WhoWeHelp'
                defaultMessage='Who we help'
                description='Section title on landing page before list of opportunities'
              />
            </h2>
            <div class="personaContainer">
            <div class="personaBox"> 
              <img src="/static/img/Volunteers.png"class="personaImage"></img>
              <div class="personaTitle">Volunteers</div>
              <div class="personaDescription">Discover cool opportunities to help out teachers, students and charities. We handle the paperwork and admin so you can spend more time helping people.</div>
              <Button type='primary' shape='round' size='large' >See activities</Button>
            </div>
            <div class="personaBox"> 
              <img src="/static/img/Teachers.png" class="personaImage"></img>
              <div class="personaTitle">Teachers</div>
              <div class="personaDescription">Finding it hard to teach a specific concept? Call in a skilled volunteer to help you communicate or teach tech in your classroom.</div>
              <Button type='primary' shape='round' size='large' >Learn more</Button>
            </div>
            <div class="personaBox"> 
              <img src="/static/img/Content.png" class="personaImage"></img>
              <div class="personaTitle">Educational Content Providers</div>
              <div class="personaDescription">Discover cool opportunities to help out teachers, students and charities. We handle the paperwork and admin so you can spend more time helping people.</div>
              <Button type='secondary' shape='round' size='large' >Get in touch</Button>
            </div>
            <div class="personaBox"> 
              <img src="/static/img/Business.png" class="personaImage"></img>
              <div class="personaTitle">Corporates</div>
              <div class="personaDescription">Discover cool opportunities to help out teachers, students and charities. We handle the paperwork and admin so you can spend more time helping people.</div>
              <Button type='secondary' shape='round' size='large' >Get in touch</Button>
            </div>
            </div>
          </section>
          <div class="spacer"></div>
          <section>
            <h2>
              <FormattedMessage
                id='UpcomingOpportunities'
                defaultMessage='Happening soon'
                description='Section title on landing page before list of opportunities'
              />
            </h2>
            {/* @todo will style components here then convert to components */}
            <OpListSection store={this.props.store} />
            <Link href={'/op/new'} >
              <Button type='primary' shape='round' >
                <FormattedMessage id='landing.newOp' defaultMessage='New Opportunity' description='Button to create a new opportunity on Landing page' />
              </Button>
            </Link>
          </section>          
        </div>  
        </FullPage>

      </div>
    )
  }
}

export default publicPage(Landing)
