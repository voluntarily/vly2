import styled from 'styled-components'

export const SponsorContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 10rem);
  grid-gap: 4rem;
  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    grid-gap: 2rem;
    margin-top: 2rem;
    margin-bottom: 4rem;
  }
`
export const SponsorIcon = styled.img`
  object-fit: cover;
  object-position: center;

  height: 10rem;
  width: 10rem;
  @media screen and (max-width: 768px) {
    width: 100%;
    object-fit: contain;
    margin-right: 1rem;
    margin-bottom: 1rem;
  }
`
