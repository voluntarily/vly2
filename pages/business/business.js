import React, { Component } from 'react'
import styled from 'styled-components'
import publicPage, { FullPage } from '../../hocs/publicPage'
import { HalfGrid } from '../../components/VTheme/VTheme'
import { Button } from 'antd';

const FullPage2Grid = styled.div`
  width: 100vw;
  display: grid;
  grid-gap: 0;
  grid-template-columns: 50vw 50vw;
`

const HalfContainer = styled.div`
  /* background-color: yellow;
  border: 3px solid red; */
  width: 50vw;
  height: 50rem;
`

const LeftAlign = styled.div`
  top: 18rem;
  position: relative;
  margin-left: 4rem;
  margin-right: 4rem;
`
const HeaderLol = styled.h1`

  font-size: 3rem;
  letter-spacing: -2.2px;
  font-weight: 700;
`

const MiniTitle = styled.p`

width: 12.8rem;
color: black;
font-size: 1rem;
font-weight: 400;
margin-bottom: 0;
border-radius: 12px;

`

export class Business extends Component {
  render () {
    return (
      <div>
        <FullPage2Grid>
          <HalfContainer>
            <LeftAlign>
                <MiniTitle>Voluntarily for Business</MiniTitle>
              <HeaderLol>Find more ways to engage your community with CSR initiatives.</HeaderLol>
              <Button type='primary'>Learn more</Button>   <Button>Sign up</Button>
            </LeftAlign>
          </HalfContainer>
            <LeftAlign>
                <p>
                A company-first structure delivers maximum impact at the individual, team and organizational level. Adding services is a matter of speed of action, while the key to cross-fertilization is technical excellence. The project manager cross-pollinates a leadership culture. As a result, the customers engineer solid values.
Operating strategy won't happen without leadership strategies. Attractiveness is a matter of speed of action. A breakneck increase in sales goes hand-in-hand with a continual efficiency gain. The initiator cautiously solutionizes a right, quality-oriented and leading adaptability.
We must activate the silo to co-specify an excellence. As a result, the rockstar takes a bite out of a cross-sell message.
The challenger co-specifies fit-for-purpose requests / solutions; nevertheless our high-quality accomplishment transfers the Digital Marketers. The thought leaders influence cost savings.
                </p>
            </LeftAlign>
          <HalfContainer />
        </FullPage2Grid>
      </div>
    )
  }
}

export default publicPage(Business)
