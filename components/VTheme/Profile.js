import styled from 'styled-components'

export const ProfileBanner = styled.header`
display: grid;
grid-template-columns: 100%;
align-self: center;
justify-self: center;

@media screen and (min-width: 767px) {
  grid-template-columns: 25% 75%;
}

img {
  width: 16rem;
  object-fit: cover;
  align-self: center;
  justify-self: center;
}
`
export const ProfileBannerTitle = styled.div`

@media screen and (min-width: 767px) {
  padding-left: 3rem;
  text-align: left;
}

a {
  display: block;
  padding: 1rem 0;
}
`
export const ProfileTabs = styled.nav`
  text-align: left;
  display: grid;
  grid-template-columns: 100%;
  margin-top: 3rem;
  margin-bottom: 3rem;
  width: 100%;

  @media screen and (min-width: 767px) {
    grid-template-columns: 20% 80%;
  }
`

export const ProfileTab = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: #6549AA;
`

export const ProfilePanel = styled.article`
  text-align: left;
`

export const ProfileSection = styled.section`
  margin: 1.5rem 0 0 0;
`
