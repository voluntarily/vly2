import { Button, Col, Input, Row, Divider } from 'antd'
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
                <p class="vGridContainerText">
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
            <h2 class="blockTitle">
              <FormattedMessage
                id='WhoWeHelp'
                defaultMessage='Who we help'
                description='Section title on landing page before list of opportunities'
              />
            </h2>
            <div class="request4grid">
              <div class="personaContainer">
                <img class="lol" src='/static/img/volunteerCard.png' alt='About' />
                <h5 class="personaTitle">Volunteers</h5>
                <p class="personaText">Discover cool opportunities to help out teachers, students and charities.</p>
              </div>
              <div class="personaContainer">
                <img class="lol" src='/static/img/teacherCard.png' alt='About' />
                <h5 class="personaTitle">Teachers</h5>
                <p class="personaText">Get the help of skilled volunteers to  bring tech to your classroom.</p>
              </div>
              <div class="personaContainer">
                <img class="lol" src='/static/img/contentCard.png' alt='About' />
                <h5 class="personaTitle">Content providers</h5>
                <p class="personaText">We help you get more people involved with your movement.</p>
              </div>
              <div class="personaContainer">
                <img class="lol" src='/static/img/businessCard.png' alt='About' />
                <h5 class="personaTitle">Businesses</h5>
                <p class="personaText">We handle the admin so your people have a better time volunteering.</p>
              </div>
          
            </div>
          </section>

          <div class="spacer"></div>
          
          <section>
            <h2 class="blockTitle">
              <FormattedMessage
                id='UpcomingOpportunities'
                defaultMessage='Happening soon'
                description='Section title on landing page before list of opportunities'
              />
            </h2>

            {/* @todo will style components here then convert to components */}
            <div class="request4grid">
            <div class="requestContainer">
              <img class="requestImg" src="https://placedog.net/640/480?id=5"></img>
              <h6 class="requestTitle">Make a dog robot</h6>
              <h6 class="requestDateTime">23 Jan / Lynnfield Primary School</h6>
              <p class="requestDescription">Make awesome gadgets with Arduino because aruduino is a great way to learn tech</p>
            </div>
            <div class="requestContainer">
              <img class="requestImg" src="https://placedog.net/640/480?id=6"></img>
              <h6 class="requestTitle">Machine Learning to do better rubbish recycling</h6>
              <h6 class="requestDateTime">23 Jan / Lynnfield Primary School</h6>
              <p class="requestDescription">Make awesome gadgets with Arduino because aruduino is a great way to learn tech</p>
            </div>
            <div class="requestContainer">
              <img class="requestImg" src="https://placedog.net/640/480?id=7"></img>
              <h6 class="requestTitle">Machine Learning to do better rubbish recycling</h6>
              <h6 class="requestDateTime">23 Jan / Lynnfield Primary School</h6>
              <p class="requestDescription">Make awesome gadgets with Arduino because aruduino is a great way to learn tech</p>
            </div>
            <div class="requestContainer">
              <img class="requestImg" src="https://placedog.net/640/480?id=8"></img>
              <h6 class="requestTitle">Machine Learning to do better rubbish recycling</h6>
              <h6 class="requestDateTime">23 Jan / Lynnfield Primary School</h6>
              <p class="requestDescription">Make awesome gadgets with Arduino because aruduino is a great way to learn tech</p>
            </div>

            <div class="requestContainer">
              <img class="requestImg" src="https://placedog.net/640/480?id=9"></img>
              <h6 class="requestTitle">Machine Learning to do better rubbish recycling</h6>
              <h6 class="requestDateTime">23 Jan / Lynnfield Primary School</h6>
              <p class="requestDescription">Make awesome gadgets with Arduino because aruduino is a great way to learn tech</p>
            </div>
            <div class="requestContainer">
              <img class="requestImg" src="https://placedog.net/640/480?id=10"></img>
              <h6 class="requestTitle">Machine Learning to do better rubbish recycling</h6>
              <h6 class="requestDateTime">23 Jan / Lynnfield Primary School</h6>
              <p class="requestDescription">Make awesome gadgets with Arduino because aruduino is a great way to learn tech</p>
            </div>
            <div class="requestContainer">
              <img class="requestImg" src="https://placedog.net/640/480?id=11"></img>
              <h6 class="requestTitle">Machine Learning to do better rubbish recycling</h6>
              <h6 class="requestDateTime">23 Jan / Lynnfield Primary School</h6>
              <p class="requestDescription">Make awesome gadgets with Arduino because aruduino is a great way to learn tech</p>
            </div>
            <div class="requestContainer">
              <img class="requestImg" src="https://placedog.net/640/480?id=12"></img>
              <h6 class="requestTitle">Machine Learning to do better rubbish recycling</h6>
              <h6 class="requestDateTime">23 Jan / Lynnfield Primary School</h6>
              <p class="requestDescription">Make awesome gadgets with Arduino because aruduino is a great way to learn tech</p>
            </div>

            </div>
            <Divider></Divider>
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
