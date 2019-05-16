import { Button, Divider } from 'antd'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import publicPage, { FullPage } from '../../hocs/publicPage'
// import OpListSection from '../../components/Op/OpListSection'
import Hero from '../../components/HeroPage/Hero'
import '../../pages/landing2/landing.less'
// import schoolsactivity from './schoolsactivity.png'

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

export class Landing2 extends Component {
  render () {
    return (
      <FullPage>
        <Hero />

        <div className='vGridContainer'>
          <section>
            <div className='aboutContainer'>
              <div className='centeredDiv'>
                <h2>
                  <FormattedMessage
                    id='SupportUs'
                    defaultMessage='Support Innovation in the classNameroom.'
                    description='Sub heading for the call to action section of the landing page'
                  />
                </h2>
                <p className='vGridContainerText'>
                  <FormattedMessage
                    id='AboutUs'
                    // eslint-disable-next-line max-len
                    defaultMessage='Voluntarily connects you with classNamerooms to teach science, technology, engineering, entrepreneurship, arts and design with the help of engaging content supplied by New Zealand’s leading innovators in educational content. '
                    description='body text of the about Voluntarily section.'
                  />
                </p>
                <br />
                <Button type='primary' shape='round' size='large' href='/about'>
                  <FormattedMessage
                    id='LearnMore'
                    defaultMessage='Learn More'
                    description='Action button to learn more about Voluntari.ly'
                  />
                </Button>
              </div>
              {/* <img src={schoolsactivity} alt='About' /> */}
              <img
                className='aboutImg'
                src='/static/img/schoolsactivity.png'
                alt='About'
              />
            </div>
          </section>
          <div className='spacer' />
          <section>
            <h2 className='blockTitle'>
              <FormattedMessage
                id='WhoWeHelp'
                defaultMessage='How we help'
                description='Section title on landing page before list of opportunities'
              />
            </h2>
            <p className='blockDescription'>
              We help these awesome people accomplish amazing things
            </p>
            <div className='request4grid'>
              <div className='personaContainer'>
                <img
                  className='personaImage'
                  src='/static/img/volunteerCard.png'
                  alt='About'
                />
                <h5 className='personaTitle'>Volunteers</h5>
                <p className='personaText'>
                  Discover cool opportunities to help out teachers, students and
                  charities.
                </p>
                <a className='personaTextLink' href='#'>
                  Browse activities
                </a>
              </div>
              <div className='personaContainer'>
                <img
                  className='personaImage'
                  src='/static/img/teacherCard.png'
                  alt='About'
                />
                <h5 className='personaTitle'>Educators</h5>
                <p className='personaText'>
                  Get the help of skilled volunteers to bring tech to your
                  teaching.
                </p>
                <a className='personaTextLink' href='#'>
                  Learn more
                </a>
              </div>
              <div className='personaContainer'>
                <img
                  className='personaImage'
                  src='/static/img/contentCard.png'
                  alt='About'
                />
                <h5 className='personaTitle'>Charities</h5>
                <p className='personaText'>
                  We help you get more people involved with your movement.
                </p>
                <a className='personaTextLink' href='#'>
                  Learn more
                </a>
              </div>
              <div className='personaContainer'>
                <img
                  className='personaImage'
                  src='/static/img/businessCard.png'
                  alt='About'
                />
                <h5 className='personaTitle'>Businesses</h5>
                <p className='personaText'>
                  We handle the admin so your people have a better time
                  volunteering.
                </p>
                <a className='personaTextLink' href='#'>
                  Learn more
                </a>
              </div>
            </div>
          </section>
          <Divider />
          <div className='spacer' />
          <section>
            <h2 className='blockTitle'>
              <FormattedMessage
                id='UpcomingOpportunities'
                defaultMessage='Happening near you'
                description='Section title on landing page before list of opportunities'
              />
            </h2>
            <p className='blockDescription'>
              Get involved in your local community by using your skills 😀{' '}
            </p>

            {/* @todo will style components here then convert to components */}
            <div className='request4grid'>
              <div className='requestContainer'>
                <img
                  className='requestImg'
                  src='https://placedog.net/640/480?id=5'
                />
                <h6 className='requestTitle'>I need help teaching robotics</h6>
                <h6 className='requestDateTime'>23 Jan / Albany Senior High</h6>
                <p className='requestDescription'>
                  I want to build dog robots with Arduino because arduino boards
                  are a great way to learn tech
                </p>
              </div>
              <div className='requestContainer'>
                <img
                  className='requestImg'
                  src='https://placedog.net/640/480?id=6'
                />
                <h6 className='requestTitle'>
                  Need help explaining sorting algorithms
                </h6>
                <h6 className='requestDateTime'>
                  23 Jan / Albany Senior High School
                </h6>
                <p className='requestDescription'>
                  I need help explaining the difference between binary sort and
                  bubble sort to my students
                </p>
              </div>
              <div className='requestContainer'>
                <img
                  className='requestImg'
                  src='https://placedog.net/640/480?id=7'
                />
                <h6 className='requestTitle'>Engineering with paper bridges</h6>
                <h6 className='requestDateTime'>23 Jan / Albany Senior High</h6>
                <p className='requestDescription'>
                  learn engineering by making bridges out of paper and making
                  them do things
                </p>
              </div>
              <div className='requestContainer'>
                <img
                  className='requestImg'
                  src='https://placedog.net/640/480?id=8'
                />
                <h6 className='requestTitle'>
                  Learning Map Skills with Google Maps
                </h6>
                <h6 className='requestDateTime'>
                  23 Jan / Albany Senior High School
                </h6>
                <p className='requestDescription'>
                  We need a developer to help us deal with the google maps API
                </p>
              </div>
              <div className='requestContainer'>
                <img
                  className='requestImg'
                  src='https://placedog.net/640/480?id=9'
                />
                <h6 className='requestTitle'>Make a dog robot</h6>
                <h6 className='requestDateTime'>
                  23 Jan / Albany Senior High School
                </h6>
                <p className='requestDescription'>
                  Make awesome gadgets with Arduino because aruduino is a great
                  way to learn tech
                </p>
              </div>
              <div className='requestContainer'>
                <img
                  className='requestImg'
                  src='https://placedog.net/640/480?id=10'
                />
                <h6 className='requestTitle'>
                  Audit my energy efficiency experiments
                </h6>
                <h6 className='requestDateTime'>
                  23 Jan / Albany Senior High School
                </h6>
                <p className='requestDescription'>
                  I need a scientist to validate my science project criteria
                </p>
              </div>
              <div className='requestContainer'>
                <img
                  className='requestImg'
                  src='https://placedog.net/640/480?id=11'
                />
                <h6 className='requestTitle'>
                  I need help teaching scratch programming
                </h6>
                <h6 className='requestDateTime'>
                  23 Jan / Albany Senior High School
                </h6>
                <p className='requestDescription'>
                  I don't understand why my code isn't working
                </p>
              </div>
              <div className='requestContainer'>
                <img
                  className='requestImg'
                  src='https://placedog.net/640/480?id=12'
                />
                <h6 className='requestTitle'>Web developer needed</h6>
                <h6 className='requestDateTime'>
                  23 Jan / Albany Senior High School
                </h6>
                <p className='requestDescription'>
                  I need help teaching good CSS practices so my students write
                  awesome code
                </p>
              </div>
            </div>
            <Divider />
            <div className='spacer' />

            {/* <OpListSection store={this.props.store} />
            <Link href={'/op/new'} >
              <Button type='primary' shape='round' >
                <FormattedMessage id='landing.newOp' defaultMessage='New Opportunity' description='Button to create a new opportunity on Landing page' />
              </Button>
            </Link> */}
          </section>

          <section>
            <h2 className='blockTitle'>Happening near you</h2>
            <p className='blockDescription'>
              Get involved in your community by helping out with an activity
              below{' '}
            </p>

            {/* @todo will style components here then convert to components */}
            <div className='request4grid'>
              <div className='requestContainer'>
                <img
                  className='requestImg'
                  src='https://placedog.net/640/480?id=13'
                />
                <h6 className='requestTitle'>Make a dog robot</h6>
                <h6 className='requestDateTime'>
                  23 Jan / Albany Senior High School
                </h6>
                <p className='requestDescription'>
                  Make awesome gadgets with Arduino because aruduino is a great
                  way to learn tech
                </p>
              </div>
              <div className='requestContainer'>
                <img
                  className='requestImg'
                  src='https://placedog.net/640/480?id=14'
                />
                <h6 className='requestTitle'>
                  Machine Learning to do better rubbish recycling
                </h6>
                <h6 className='requestDateTime'>
                  23 Jan / Albany Senior High School
                </h6>
                <p className='requestDescription'>
                  Make awesome gadgets with Arduino because aruduino is a great
                  way to learn tech
                </p>
              </div>
              <div className='requestContainer'>
                <img
                  className='requestImg'
                  src='https://placedog.net/640/480?id=15'
                />
                <h6 className='requestTitle'>
                  Machine Learning to do better rubbish recycling
                </h6>
                <h6 className='requestDateTime'>
                  23 Jan / Albany Senior High School
                </h6>
                <p className='requestDescription'>
                  Make awesome gadgets with Arduino because aruduino is a great
                  way to learn tech
                </p>
              </div>
              <div className='requestContainer'>
                <img
                  className='requestImg'
                  src='https://placedog.net/640/480?id=16'
                />
                <h6 className='requestTitle'>
                  Machine Learning to do better rubbish recycling
                </h6>
                <h6 className='requestDateTime'>
                  23 Jan / Albany Senior High School
                </h6>
                <p className='requestDescription'>
                  Make awesome gadgets with Arduino because aruduino is a great
                  way to learn tech
                </p>
              </div>
              <div className='requestContainer'>
                <img
                  className='requestImg'
                  src='https://placedog.net/640/480?id=17'
                />
                <h6 className='requestTitle'>Make a dog robot</h6>
                <h6 className='requestDateTime'>
                  23 Jan / Albany Senior High School
                </h6>
                <p className='requestDescription'>
                  Make awesome gadgets with Arduino because aruduino is a great
                  way to learn tech
                </p>
              </div>
              <div className='requestContainer'>
                <img
                  className='requestImg'
                  src='https://placedog.net/640/480?id=18'
                />
                <h6 className='requestTitle'>
                  Machine Learning to do better rubbish recycling
                </h6>
                <h6 className='requestDateTime'>
                  23 Jan / Albany Senior High School
                </h6>
                <p className='requestDescription'>
                  Make awesome gadgets with Arduino because aruduino is a great
                  way to learn tech
                </p>
              </div>
              <div className='requestContainer'>
                <img
                  className='requestImg'
                  src='https://placedog.net/640/480?id=19'
                />
                <h6 className='requestTitle'>
                  Machine Learning to do better rubbish recycling
                </h6>
                <h6 className='requestDateTime'>
                  23 Jan / Albany Senior High School
                </h6>
                <p className='requestDescription'>
                  Make awesome gadgets with Arduino because aruduino is a great
                  way to learn tech
                </p>
              </div>
              <div className='requestContainer'>
                <img
                  className='requestImg'
                  src='https://placedog.net/640/480?id=20'
                />
                <h6 className='requestTitle'>
                  Machine Learning to do better rubbish recycling
                </h6>
                <h6 className='requestDateTime'>
                  23 Jan / Albany Senior High School
                </h6>
                <p className='requestDescription'>
                  Make awesome gadgets with Arduino because aruduino is a great
                  way to learn tech
                </p>
              </div>
              <div className='requestContainer'>
                <img
                  className='requestImg'
                  src='https://placedog.net/640/480?id=21'
                />
                <h6 className='requestTitle'>Make a dog robot</h6>
                <h6 className='requestDateTime'>
                  23 Jan / Albany Senior High School
                </h6>
                <p className='requestDescription'>
                  Make awesome gadgets with Arduino because aruduino is a great
                  way to learn tech
                </p>
              </div>
              <div className='requestContainer'>
                <img
                  className='requestImg'
                  src='https://placedog.net/640/480?id=22'
                />
                <h6 className='requestTitle'>
                  Machine Learning to do better rubbish recycling
                </h6>
                <h6 className='requestDateTime'>
                  23 Jan / Albany Senior High School
                </h6>
                <p className='requestDescription'>
                  Make awesome gadgets with Arduino because aruduino is a great
                  way to learn tech
                </p>
              </div>
              <div className='requestContainer'>
                <img
                  className='requestImg'
                  src='https://placedog.net/640/480?id=23'
                />
                <h6 className='requestTitle'>
                  Machine Learning to do better rubbish recycling
                </h6>
                <h6 className='requestDateTime'>
                  23 Jan / Albany Senior High School
                </h6>
                <p className='requestDescription'>
                  Make awesome gadgets with Arduino because aruduino is a great
                  way to learn tech
                </p>
              </div>
              <div className='requestContainer'>
                <img
                  className='requestImg'
                  src='https://placedog.net/640/480?id=24'
                />
                <h6 className='requestTitle'>
                  Machine Learning to do better rubbish recycling
                </h6>
                <h6 className='requestDateTime'>
                  23 Jan / Albany Senior High School
                </h6>
                <p className='requestDescription'>
                  Make awesome gadgets with Arduino because aruduino is a great
                  way to learn tech
                </p>
              </div>
              <div className='requestContainer'>
                <img
                  className='requestImg'
                  src='https://placedog.net/640/480?id=25'
                />
                <h6 className='requestTitle'>Make a dog robot</h6>
                <h6 className='requestDateTime'>
                  23 Jan / Albany Senior High School
                </h6>
                <p className='requestDescription'>
                  Make awesome gadgets with Arduino because aruduino is a great
                  way to learn tech
                </p>
              </div>
              <div className='requestContainer'>
                <img
                  className='requestImg'
                  src='https://placedog.net/640/480?id=26'
                />
                <h6 className='requestTitle'>
                  Machine Learning to do better rubbish recycling
                </h6>
                <h6 className='requestDateTime'>
                  23 Jan / Albany Senior High School
                </h6>
                <p className='requestDescription'>
                  Make awesome gadgets with Arduino because aruduino is a great
                  way to learn tech
                </p>
              </div>
              <div className='requestContainer'>
                <img
                  className='requestImg'
                  src='https://placedog.net/640/480?id=27'
                />
                <h6 className='requestTitle'>
                  Machine Learning to do better rubbish recycling
                </h6>
                <h6 className='requestDateTime'>
                  23 Jan / Albany Senior High School
                </h6>
                <p className='requestDescription'>
                  Make awesome gadgets with Arduino because aruduino is a great
                  way to learn tech
                </p>
              </div>
              <div className='requestContainer'>
                <img
                  className='requestImg'
                  src='https://placedog.net/640/480?id=28'
                />
                <h6 className='requestTitle'>
                  Machine Learning to do better rubbish recycling
                </h6>
                <h6 className='requestDateTime'>
                  23 Jan / Albany Senior High School
                </h6>
                <p className='requestDescription'>
                  Make awesome gadgets with Arduino because aruduino is a great
                  way to learn tech
                </p>
              </div>
            </div>
            <Divider />
            {/* <OpListSection store={this.props.store} />
            <Link href={'/op/new'} >
              <Button type='primary' shape='round' >
                <FormattedMessage id='landing.newOp' defaultMessage='New Opportunity' description='Button to create a new opportunity on Landing page' />
              </Button>
            </Link> */}
          </section>
        </div>
      </FullPage>
    )
  }
}

export default publicPage(Landing2)
