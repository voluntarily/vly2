import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const TitleContainer = styled.div`
  margin-top: 4rem;
  height: 5rem;
  padding: 15px;
`

const TitleSection = ({ title, ...props }) => (
  <TitleContainer>
    <h2>{title}</h2>
  </TitleContainer>
)

TitleSection.propTypes = {
  op: PropTypes.shape({
    title: PropTypes.string.isRequired
  })
}

export default TitleSection
