import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { H3Black } from '../VTheme/VTheme'

const TitleContainer = styled.div`
  margin-top: 4rem;
  height: 5rem;
`

const TitleSection = ({ title, ...props }) => (
  <TitleContainer>
    <H3Black>{title}</H3Black>
  </TitleContainer>
)

TitleSection.propTypes = {
  op: PropTypes.shape({
    title: PropTypes.string.isRequired
  })
}

export default TitleSection
