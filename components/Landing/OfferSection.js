import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { Card, Grid, TitleContainerMid, H2 } from '../VTheme/VTheme'
import Image from 'next/image'
const ImageWrapper = styled.div`
  position: relative;

`
const CardTitle = styled.h4`
margin-top: 0.5rem;
font-size: 1.15rem;
font-weight: 500;
text-align: center;
`

const OfferSection = () => (
  <div>
    <TitleContainerMid><H2>Featured activities </H2></TitleContainerMid>
    <Grid>
      <Card>
        <Link href='https://live.voluntarily.nz/acts/5e7abf953d0c1400117903c0' passHref>
          <ImageWrapper>

            <Image alt='cybersecurity icon' src='/static/img/landing-pages/featuredacts/cyber.png' />

            {/* <OpTypeStamp type={op.type} /> */}
          </ImageWrapper>
          <figcaption>

            <CardTitle>
              Cybersecurity
            </CardTitle>
          </figcaption>
        </Link>
      </Card>
      <Card>
        <Link href='https://live.voluntarily.nz/acts/5e86804c9f1b8e0011d262ea' passHref>
          <ImageWrapper>

            <Image alt='home office' src='/static/img/landing-pages/featuredacts/homeoffice.png' />

            {/* <OpTypeStamp type={op.type} /> */}
          </ImageWrapper>
          <figcaption>

            <CardTitle>
              Setting up a home office
            </CardTitle>
          </figcaption>
        </Link>
      </Card>
      <Card>
        <Link href='https://live.voluntarily.nz/acts/5e7ad512bce4460011276ed1' passHref>
          <ImageWrapper>

            <Image alt='cashflow' src='/static/img/landing-pages/featuredacts/cashflow.png' />

            {/* <OpTypeStamp type={op.type} /> */}
          </ImageWrapper>
          <figcaption>

            <CardTitle>
              Cashflow &amp; Budgeting Advice
            </CardTitle>
          </figcaption>
        </Link>
      </Card>
      <Card>
        <Link href='https://live.voluntarily.nz/acts/5e7ac24baefa5a0011056daf' passHref>
          <ImageWrapper>

            <Image alt='health' src='/static/img/landing-pages/featuredacts/health.png' />

            {/* <OpTypeStamp type={op.type} /> */}
          </ImageWrapper>
          <figcaption>

            <CardTitle>
              Health &amp; Safety
            </CardTitle>
          </figcaption>
        </Link>
      </Card>
      <Card>
        <Link href='https://live.voluntarily.nz/acts/5eaa53c799524f0013d82c04' passHref>
          <ImageWrapper>

            <Image alt='remote' src='/static/img/landing-pages/featuredacts/remote.png' />

            {/* <OpTypeStamp type={op.type} /> */}
          </ImageWrapper>
          <figcaption>

            <CardTitle>
              Remote Learning Support
            </CardTitle>
          </figcaption>
        </Link>
      </Card>
      <Card>
        <Link href='https://live.voluntarily.nz/acts/5e7ac2a43d0c1400117903cf' passHref>
          <ImageWrapper>

            <Image alt='legal' src='/static/img/landing-pages/featuredacts/legal.png' />

            {/* <OpTypeStamp type={op.type} /> */}
          </ImageWrapper>
          <figcaption>

            <CardTitle>
              Legal Help
            </CardTitle>
          </figcaption>
        </Link>
      </Card>
      <Card>
        <Link href='https://live.voluntarily.nz/acts/5e7ac165aefa5a0011056da6' passHref>
          <ImageWrapper>

            <Image alt='tax' src='/static/img/landing-pages/featuredacts/tax.png' />

            {/* <OpTypeStamp type={op.type} /> */}
          </ImageWrapper>
          <figcaption>

            <CardTitle>
              Tax
            </CardTitle>
          </figcaption>
        </Link>
      </Card>

      <Card>
        <Link href='https://live.voluntarily.nz/acts/5e7ab8fc229dbd0011aae2aa' passHref>
          <ImageWrapper>

            <Image alt='video' src='/static/img/landing-pages/featuredacts/video.png' />

            {/* <OpTypeStamp type={op.type} /> */}
          </ImageWrapper>
          <figcaption>

            <CardTitle>
              Video Conferencing
            </CardTitle>
          </figcaption>
        </Link>
      </Card>

    </Grid>

  </div>

)

export default OfferSection
