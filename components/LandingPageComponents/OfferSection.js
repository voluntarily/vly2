import React from 'react'
import styled from 'styled-components'
import { Card, Grid, TitleContainerMid } from '../VTheme/VTheme'
const ImageWrapper = styled.div`
  position: relative;

`
const OfferSection = () => (
  <div>
    <TitleContainerMid><h1>Featured activities</h1></TitleContainerMid>
    <Grid>
      <Card>
        <a href='https://live.voluntarily.nz/acts/5e7abf953d0c1400117903c0'>
          <ImageWrapper>

            <img src='/static/img/landing-pages/featuredacts/cyber.png' />

            {/* <OpTypeStamp type={op.type} /> */}
          </ImageWrapper>
          <figcaption>

            <p>
              Cybersecurity
            </p>
          </figcaption>
        </a>
      </Card>
      <Card>
        <a href='https://live.voluntarily.nz/acts/5e86804c9f1b8e0011d262ea'>
          <ImageWrapper>

            <img src='/static/img/landing-pages/featuredacts/homeoffice.png' />

            {/* <OpTypeStamp type={op.type} /> */}
          </ImageWrapper>
          <figcaption>

            <p>
              Setting up a home office
            </p>
          </figcaption>
        </a>
      </Card>
      <Card>
        <a href='https://live.voluntarily.nz/acts/5e7ad512bce4460011276ed1'>
          <ImageWrapper>

            <img src='/static/img/landing-pages/featuredacts/cashflow.png' />

            {/* <OpTypeStamp type={op.type} /> */}
          </ImageWrapper>
          <figcaption>

            <p>
              Cashflow &amp; Budgeting Advice
            </p>
          </figcaption>
        </a>
      </Card>
      <Card>
        <a href='https://live.voluntarily.nz/acts/5e7ac24baefa5a0011056daf'>
          <ImageWrapper>

            <img src='/static/img/landing-pages/featuredacts/health.png' />

            {/* <OpTypeStamp type={op.type} /> */}
          </ImageWrapper>
          <figcaption>

            <p>
              Health &amp; Safety
            </p>
          </figcaption>
        </a>
      </Card>
      <Card>
        <a href='https://live.voluntarily.nz/acts/5eaa53c799524f0013d82c04'>
          <ImageWrapper>

            <img src='/static/img/landing-pages/featuredacts/remote.png' />

            {/* <OpTypeStamp type={op.type} /> */}
          </ImageWrapper>
          <figcaption>

            <p>
              Remote Learning Support
            </p>
          </figcaption>
        </a>
      </Card>
      <Card>
        <a href='https://live.voluntarily.nz/acts/5e7ac2a43d0c1400117903cf'>
          <ImageWrapper>

            <img src='/static/img/landing-pages/featuredacts/legal.png' />

            {/* <OpTypeStamp type={op.type} /> */}
          </ImageWrapper>
          <figcaption>

            <p>
              Legal Help
            </p>
          </figcaption>
        </a>
      </Card>
      <Card>
        <a href='https://live.voluntarily.nz/acts/5e7ac165aefa5a0011056da6'>
          <ImageWrapper>

            <img src='/static/img/landing-pages/featuredacts/tax.png' />

            {/* <OpTypeStamp type={op.type} /> */}
          </ImageWrapper>
          <figcaption>

            <p>
              Tax
            </p>
          </figcaption>
        </a>
      </Card>

      <Card>
        <a href='https://live.voluntarily.nz/acts/5e7ab8fc229dbd0011aae2aa'>
          <ImageWrapper>

            <img src='/static/img/landing-pages/featuredacts/video.png' />

            {/* <OpTypeStamp type={op.type} /> */}
          </ImageWrapper>
          <figcaption>

            <p>
              Video Conferencing
            </p>
          </figcaption>
        </a>
      </Card>

    </Grid>

  </div>

)

export default OfferSection
