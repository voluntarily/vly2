import React from 'react'
import { FullPage, Spacer, H1 } from './VTheme/VTheme'

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
        <H1>
          You don't have access to this page 😅 <br />
          Try and<a href='/auth/sign-in'> sign in</a> to see it?
        </H1>
      </center>
    </FullPage>
  </div>
)
