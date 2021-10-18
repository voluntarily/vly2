import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { H5 } from '../VTheme/VTheme'

const TitleContainer = styled.div`
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  position: relative;
`

const SectionSubtitle = ({ title, subtitle, ...props }) => (
  <TitleContainer>
    <h2>{title}</h2>
    <H5>{subtitle}</H5>
  </TitleContainer>
)

SectionSubtitle.propTypes = {
  op: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired
  })
}

export default SectionSubtitle
