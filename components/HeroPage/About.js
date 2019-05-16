import React from 'react'
import styled from 'styled-components'
import { Button, Input } from 'antd'

const HalfGrid = styled.div`
  display: grid;
  grid-template-columns: 39rem 39rem;
  grid-column-gap: 2rem;

  @media screen and (min-width: 768px) and (max-width: 1025px) {
    width: calc(100vw - 4rem);
    grid-template-columns: calc(50vw - 2rem) calc(50vw - 2rem);
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: calc(100vw - 2rem);
  }
`
const AboutLeft = styled.div`
  margin-top: 14%;

  @media screen and (min-width: 768px) and (max-width: 1025px) {
    margin-top: 1rem;
    margin-right: 2rem;
  }

  @media screen and (max-width: 768px) {
    margin-top: initial;
    margin-left: 1rem;
    margin-bottom: 3rem;
  }
`

const AboutRight = styled.img`
  width: 39rem;
  justify-self: end;

  @media screen and (min-width: 1026px) and (max-width: 1281px) {
    width: 32rem;
    justify-self: start;
    margin-left: 2rem;
  }

  @media screen and (min-width: 768px) and (max-width: 1025px) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media screen and (max-width: 768px) {
    width: 100vw;
    justify-self: start;
    margin: initial;
  }
`
