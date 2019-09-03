import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { H3Black, H5 } from '../VTheme/VTheme'

const TitleContainer = styled.div`
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  position: relative;
`

const TitleSectionSub = ({ title, subtitle, ...props }) => (
  <TitleContainer>
    <H3Black>{title}</H3Black>
    <H5>{subtitle}</H5>
  </TitleContainer>
)

TitleSectionSub.propTypes = {
  op: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired
  })
}

export default TitleSectionSub
