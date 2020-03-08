import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { HalfGrid } from '../VTheme/VTheme'
import { Button } from 'antd'

const PromoImage = styled.img`
width: 100%;
overflow: hidden;
object-fit: top;
`

const PromoContainer = styled.div`
align-self: center;

small {
    font-size: 1rem;
    opacity: 1;
}
`

const ITFPromo = () => (
  <HalfGrid>
    <PromoImage src='./static/img/landing-pages/promo/itf.png' alt='image of many children smiling' />
    <PromoContainer>
      <small>
        <FormattedMessage id='landing.promoSection.small' defaultMessage='Featured programme' description='Subheading for Inspiring The Future Promo Section' />
      </small>
      <h3><FormattedMessage id='landing.promoSection.title' defaultMessage='Inspiring The Future' description='Title for Inspiring The Future Promo Section' /></h3>
      <p><FormattedMessage id='landing.promoSection.description' defaultMessage='Inspiring the Future connects children and young people in Years 3 to 8 with volunteers and role models from the world of work through a fun and inspiring activity. Sign up for an activity below.' description='Description for Inspiring The Future Promo Section' /></p><br />

      <Button type='primary' shape='round' size='large' href='https://tec.govt.nz/'>
      Learn more
      </Button>&nbsp;

      <Button shape='round' size='large' href='https://alpha.voluntarily.nz/orgs/5d7077466956020011c96ac6?tab=offers'>Get involved</Button>
    </PromoContainer>
  </HalfGrid>
)

export default ITFPromo
