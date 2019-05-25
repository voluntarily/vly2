import { Divider } from 'antd'
import React, { Component } from 'react'
import publicPage, { FullPage } from '../../hocs/publicPage'
// import OpListSection from '../../components/Op/OpListSection'
import Hero from '../../components/LandingPageComponents/Hero'
import AboutSection from '../../components/LandingPageComponents/AboutSection'
import PersonaSection from '../../components/LandingPageComponents/PersonaSection'
import TitleSectionSub from '../../components/LandingPageComponents/TitleSectionSub'
import OpListSection from '../../components/Op/OpListSection'

import '../../pages/landing2/landing.less'
import FeaturedTwoSection from '../../components/LandingPageComponents/FeaturedTwoSection'
import { Spacer } from '../../components/VTheme/VTheme'

export class Landing2 extends Component {
  render () {
    return (
      <FullPage>
        <Hero />
        <FeaturedTwoSection />
        <Spacer />

        <AboutSection
          title='Support Innovation in the classroom.'
          subtitle='Voluntarily is a platform that connects you with classrooms to teach science, technology, engineering, entrepreneurship, arts and design with the help of engaging content supplied by New Zealand’s leading innovators in educational content.'
        />
        <div className='spacer' />
        <TitleSectionSub
          title='How we help'
          subtitle='We help these awesome people accomplish amazing things'
        />
        <PersonaSection />
        <Divider />

        <div className='spacer' />
        <TitleSectionSub
          title='Happening soon'
          subtitle='These events are happening soon. You should get involved! 😀'
        />
        <OpListSection store={this.props.store} />
        <div className='spacer' />
        <section>
          <h2 className='blockTitle'>Happening near you</h2>
          <p className='blockDescription'>
            Get involved in your community by helping out with an activity below{' '}
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
      </FullPage>
    )
  }
}

export default publicPage(Landing2)
