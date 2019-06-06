import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { TextHeadingBlack, TextHeadingSubtitle } from '../VTheme/VTheme'

const TitleContainer = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
  position: relative;
`

const TitleSectionSub = ({ title, subtitle, ...props }) => (
  <TitleContainer>
    <TextHeadingBlack>{title}</TextHeadingBlack>
    <TextHeadingSubtitle>{subtitle}</TextHeadingSubtitle>
  </TitleContainer>
)

TitleSectionSub.propTypes = {
  op: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired
  })
}

export default TitleSectionSub
