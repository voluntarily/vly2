import styled from 'styled-components'
import React from 'react'
import TitleSectionSub from './TitleSectionSub'
import { HalfGrid } from '../VTheme/VTheme'
// import { Button } from 'antd'

const BigOpContainer = styled.a`
  width: 39rem;
  margin-bottom: 4rem;



  @media screen and (min-width: 768px) and (max-width: 1281px) {
    width: calc(50vw - 4rem);


    margin-bottom: 2rem;
  }

  @media screen and (max-width: 768px) {
    width: calc(100vw - 2rem);
  }

`

const BigOpImg = styled.img`
  width: 36rem;
  height: 21rem;
  object-fit: cover;
  object-position: center;

  @media screen and (min-width: 768px) and (max-width: 1281px) {
    height: 12rem;
    width: calc(50vw - 5rem);


  }


  @media screen and (max-width: 768px) {
    width: calc(100vw - 2rem);
  }
`

const BigOpTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #000000;
  letter-spacing: -0.8px;
  line-height: 40px;
  margin-bottom: 0;
`

const BigOpDateTime = styled.h1`
  font-size: 1rem;
  font-weight: 600;
  line-height: 24px;
  color: #585858;
  text-overflow: ellipsis;
  margin-bottom: 0;
  letter-spacing: -0.5px;
`

const BigOpDescription = styled.h1`
  font-size: 1rem;
  line-height: 24px;
  font-weight: 400;
  letter-spacing: -0.3px;
`

const FeaturedTwoSection = () => (
  <div>
    <TitleSectionSub
      title='Featured activities'
      subtitle='Use your skills to do awesome things this weekend.'
    />
    <HalfGrid>
      <BigOpContainer>
        <BigOpImg src='https://robotclinic.co.uk/wp-content/uploads/2018/01/Xiaomi-Mi-Robot-Vacuum-Teardown.jpg' />
        <BigOpTitle>Build robot vacuum cleaners with us</BigOpTitle>
        <BigOpDateTime>
          2 Hours / Monday 24 May / Edendale Primary School
        </BigOpDateTime>
        <BigOpDescription>
          I have a class that wants to learn about robotics and electronics by
          making autonomous robot vacuum cleaners. We have the materials, we
          just need an expert!{' '}
        </BigOpDescription>
      </BigOpContainer>

      <BigOpContainer>
        <BigOpImg src='https://images.squarespace-cdn.com/content/v1/5af8fc8bee175947dd8bce1e/1552876800436-PV42HVYXSH6CMT5GE5D1/ke17ZwdGBToddI8pDm48kPOyYgnW7nyGjASOBc05s4cUqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYxCRW4BPu10St3TBAUQYVKcmu9LPXh6MQ2js1S_zRc5FMg_8U215fhUVz0tlLN9nY9kaGBuGgADdJLkI-1Bdr5-/makey%2Bmakey.jpeg' />
        <BigOpTitle>Volunteer at the CAST technology festival</BigOpTitle>
        <BigOpDateTime>8 Hours / 25 and 26 May / MOTAT</BigOpDateTime>
        <BigOpDescription>
          We need volunteers to teach programming and technology using circuits
          to students
        </BigOpDescription>
      </BigOpContainer>
      <BigOpContainer>
        <BigOpImg src='https://robotclinic.co.uk/wp-content/uploads/2018/01/Xiaomi-Mi-Robot-Vacuum-Teardown.jpg' />
        <BigOpTitle>Build robot vacuum cleaners with us</BigOpTitle>
        <BigOpDateTime>
          2 Hours / Monday 24 May / Edendale Primary School
        </BigOpDateTime>
        <BigOpDescription>
          We want to learn about robotics and electronics by making robot
          vacuums that clean the school for us
        </BigOpDescription>
      </BigOpContainer>

      <BigOpContainer>
        <BigOpImg src='https://images.squarespace-cdn.com/content/v1/5af8fc8bee175947dd8bce1e/1552876800436-PV42HVYXSH6CMT5GE5D1/ke17ZwdGBToddI8pDm48kPOyYgnW7nyGjASOBc05s4cUqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYxCRW4BPu10St3TBAUQYVKcmu9LPXh6MQ2js1S_zRc5FMg_8U215fhUVz0tlLN9nY9kaGBuGgADdJLkI-1Bdr5-/makey%2Bmakey.jpeg' />
        <BigOpTitle>Volunteer at the CAST technology festival</BigOpTitle>
        <BigOpDateTime>8 Hours / 25 and 26 May / MOTAT</BigOpDateTime>
        <BigOpDescription>
          We need volunteers to teach programming and technology using circuits
          to students
        </BigOpDescription>
      </BigOpContainer>
      <BigOpContainer>
        <BigOpImg src='https://robotclinic.co.uk/wp-content/uploads/2018/01/Xiaomi-Mi-Robot-Vacuum-Teardown.jpg' />
        <BigOpTitle>Build robot vacuum cleaners with us</BigOpTitle>
        <BigOpDateTime>
          2 Hours / Monday 24 May / Edendale Primary School
        </BigOpDateTime>
        <BigOpDescription>
          We want to learn about robotics and electronics by making robot
          vacuums that clean the school for us
        </BigOpDescription>
      </BigOpContainer>

      <BigOpContainer>
        <BigOpImg src='https://images.squarespace-cdn.com/content/v1/5af8fc8bee175947dd8bce1e/1552876800436-PV42HVYXSH6CMT5GE5D1/ke17ZwdGBToddI8pDm48kPOyYgnW7nyGjASOBc05s4cUqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYxCRW4BPu10St3TBAUQYVKcmu9LPXh6MQ2js1S_zRc5FMg_8U215fhUVz0tlLN9nY9kaGBuGgADdJLkI-1Bdr5-/makey%2Bmakey.jpeg' />
        <BigOpTitle>Volunteer at the CAST technology festival</BigOpTitle>
        <BigOpDateTime>8 Hours / 25 and 26 May / MOTAT</BigOpDateTime>
        <BigOpDescription>
          We need volunteers to teach programming and technology using circuits
          to students
        </BigOpDescription>
      </BigOpContainer>
    </HalfGrid>
    <h1>
      <a>See more activities</a>
    </h1>
  </div>
)

export default FeaturedTwoSection
