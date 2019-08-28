import styled from 'styled-components'

export const StoryIntroContainer = styled.div`
  margin: 4rem 4rem 0 4rem;
  width: auto;
`

export const ColorGrid = styled.div`
margin: 2rem 0 4rem 0;
display: grid;
grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
gap: 1rem;
@media screen and (max-width: 767px) {
  grid-template-columns: 1fr 1fr;
  }
`

export const ColorContainer = styled.div`

`
export const ColorSwatch = styled.div`
height: 14.25rem;
`
