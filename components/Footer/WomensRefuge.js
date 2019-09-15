import React, { Fragment } from 'react'
import styled from 'styled-components'

const ShieldSiteLogo = styled.img`
  margin-top: 2rem;
  margin-bottom: 2rem;
  width: 2.5rem;
  @media screen and (min-width: 768px) and (max-width: 1280px) {
    margin-left: 2rem;
  }

  @media screen and (max-width: 767px) {
    margin-left: 1rem;
  }
`

class WomensRefuge extends React.Component {
    
    componentDidMount () {
        const frameName = new ds07o6pcmkorn({
            openElementId: "#WomensRefuge-id"
        });
        frameName.init();
    }

    render () {
      return (
        <React.Fragment>
        <script src="https://d3f5l8ze0o4j2m.cloudfront.net/m87/k33spt.js"></script>
        <a className = "WomensRefuge-class" id="WomensRefuge-id">
            <ShieldSiteLogo src="../../static/womens_refuge.png"/>
        </a>
      </React.Fragment>
      )
    }
}

export default WomensRefuge