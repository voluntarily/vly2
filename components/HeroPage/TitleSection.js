import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const TitleContainer = styled.div`
  margin-top: 5rem;
  height: 6rem;

  h1 {
    vertical-align: center;
    text-align: left;
    font-size: 2rem;
    font-weight: 900;
    letter-spacing: -1.4px;
    margin-bottom: 0;
  }

  p {
    color: #333;
    line-height: 2;
    font-size: 1.1rem;
    letter-spacing: -1px;
  }

  @media screen and (max-width: 768px) {
    p {
      line-height: 1.8;
    }
  }
`

const TitleSection = ({ title, subtitle, ...props }) => (
  <TitleContainer>
    <h1>{title}</h1>
    <p>{subtitle}</p>
  </TitleContainer>
)

TitleSection.propTypes = {
  op: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired
  })
}

export default TitleSection
