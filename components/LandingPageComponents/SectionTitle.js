import React from 'react'
import styled from 'styled-components'

const TitleContainer = styled.div`
  margin-top: 4rem;
  height: 5rem;
  padding: 15px;
`

const SectionTitle = ({ children }) => (
  <TitleContainer>
    <h2>{children}</h2>
  </TitleContainer>
)

export default SectionTitle
