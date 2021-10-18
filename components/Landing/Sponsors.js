import React from 'react'
import Image from 'next/image'
import styled from 'styled-components'
import { H2 } from '../VTheme/VTheme'

const SponsorContainer = styled.section`
  margin: 0 2rem 4rem 2rem;
  div {
      margin: 2rem 0;
      text-align: center;
  }

  article {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  place-items: center;
}

img {
      width: 100%;
      }

@media screen and (max-width:768px) {
    margin: 0;
    article {
    grid-template-columns: 1fr 1fr;
}
}


 

`

const Sponsors = () => (

  <SponsorContainer>
    <div>
      <H2>In partnership with</H2>
    </div>
    <article>

      <Image alt='' width='400' height='400' src='/static/img/partner/spark.png' />
      <Image alt='' width='400' height='400' src='/static/img/partner/innovationfund.png' />
      <Image alt='' width='400' height='400' src='/static/img/partner/moe.png' />
      <Image alt='' width='400' height='400' src='/static/img/partner/datacom.png' />
      <Image alt='' width='400' height='400' src='/static/img/partner/ateed.png' />
    </article>
  </SponsorContainer>

)

export default Sponsors
