import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { TextHeadingBlack } from '../VTheme/VTheme';

const TitleContainer = styled.div`
  margin-top: 4rem;
  height: 5rem;

  }
`

const TitleSection = ({ title, ...props }) => (
  <TitleContainer>
    <TextHeadingBlack>{title}</TextHeadingBlack>
  </TitleContainer>
)

TitleSection.propTypes = {
  op: PropTypes.shape({
    title: PropTypes.string.isRequired
  })
}

export default TitleSection
