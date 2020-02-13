import React from 'react'
import styled from 'styled-components'

const TitleContainer = styled.div`
  margin: 2rem 0;
 

`

const SectionTitle = ({ children }) => (
  <TitleContainer>
    <h4>{children}</h4>
  </TitleContainer>
)

export default SectionTitle
