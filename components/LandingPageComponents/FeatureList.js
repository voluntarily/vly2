import {
  P,
  PBold,
  TripleGrid
} from '../../components/VTheme/VTheme'
import SectionTitle from '../../components/LandingPageComponents/SectionTitle'
import styled from 'styled-components'

const SectionContainer = styled.section`
  margin: 8rem 0;
  position: relative;

  p{
    font-size: 1.5rem;
  }

  @media screen and (min-width: 1026px) and (max-width: 1281px) {
    margin-top: 5rem;
    margin-bottom: 5rem;
  }
  @media screen and (min-width: 768px) and (max-width: 1025px) {
    margin-top: 5rem;
    margin-bottom: 5rem;
  }
  @media screen and (max-width: 768px) {
    margin-top: 2.5rem;
    margin-bottom: 2.5rem;
    width: calc(100vw - 2rem);


  }



`

const ItemIcon = styled.img`
  width: 2.5rem;
  margin-top: 2rem;
  margin-bottom: 0.5rem;
` // end itemIcon

const FeatureList = () => (
  <SectionContainer>
    <SectionTitle>Features</SectionTitle>
    <TripleGrid>
      <div>
        <ItemIcon src='/static/img/icons/search.svg' />
        <PBold>Placeholder Title</PBold>
        <P>
          Voluntarily is an awesome project and this is placeholder copy
          that will be filled soon
        </P>
      </div>
      <div>
        <ItemIcon src='/static/img/icons/search.svg' />
        <PBold>Impact reporting</PBold>
        <P>
          V measures the impact your actions have on New Zealand. See
          how your business ranks in social impact on our leaderboard.
        </P>
      </div>
      <div>
        <ItemIcon src='/static/img/icons/search.svg' />
        <PBold>HR system integration</PBold>
        <P>
          V supports single sign on, so you don't have to remember extra
          credentials if you're a large corp
        </P>
      </div>
      <div>
        <ItemIcon src='/static/img/icons/search.svg' />
        <PBold>Automated police vetting</PBold>
        <P>
          V provides you and your staff with an easy way to find schools
          and charities that need help with tech.
        </P>
      </div>
      <div>
        <ItemIcon src='/static/img/icons/search.svg' />
        <PBold>Cause Targeting</PBold>
        <P>
          Our systems enable you to target specific causes you want to
          support
        </P>
      </div>
      <div>
        <ItemIcon src='/static/img/icons/search.svg' />
        <PBold>Integration</PBold>
        <P>
          V supports single sign on, so you don't have to remember extra
          credentials if you're a large corp
        </P>
      </div>
    </TripleGrid>
  </SectionContainer>
)

export default FeatureList
