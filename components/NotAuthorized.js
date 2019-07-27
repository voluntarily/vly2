import React from 'react'
// import Link from 'next/link'
// import styled from 'styled-components'
import { FullPage } from '../hocs/publicPage'
import { Spacer, TextH1 } from './VTheme/VTheme'
import Link from 'next/link'

// const Heading = styled.h1`
//   font-size: 50px;
//   font-weight: 200;
//   line-height: 40px;
//   color: #e74c3c;
// `
// const Content = styled.p`
//   font-size: 30px;
//   font-weight: 200;
//   line-height: 40px;
//   color: #e74c3c;
// `
// const ContentLink = styled.a`
//   color: #e74c3c;
//   padding-bottom: 2px;
//   border-bottom: 1px solid #c0392b;
//   text-decoration: none;
//   font-weight: 400;
//   line-height: 30px;
//   transition: border-bottom .2s;
//   &:hover {
//     border-bottom-color: #e74c3c;
//   }
// `

export default () => (
  <div>
    <FullPage>
      <Spacer />
      <center>
        <iframe
          src='https://giphy.com/embed/vPN3zK9dNL236'
          width='480'
          height='376'
          frameBorder=''
          class='giphy-embed'
          allowFullScreen
        />
        <p>
          <a href='https://giphy.com/gifs/catvidfest-no-grumpy-cat-vPN3zK9dNL236' />
        </p>
        <TextH1>
          You don't have access to this page 😅 <br />
          Try and<a href='/auth/sign-in'> sign in</a>
            sign in 
          to see it?
        </TextH1>
      </center>
    </FullPage>
  </div>
)
