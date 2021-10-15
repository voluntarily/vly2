import React from 'react'
import { FullPage, Spacer, H1 } from './VTheme/VTheme'

export const NotAuthorized = () => (
  <div>
    <FullPage>
      <Spacer />
      <center>
        <iframe
          src='https://giphy.com/embed/vPN3zK9dNL236'
          width='480'
          height='376'
          frameBorder=''
          className='giphy-embed'
          allowFullScreen
        />
        <p>
          <a href='https://giphy.com/gifs/catvidfest-no-grumpy-cat-vPN3zK9dNL236' />
        </p>
        <H1>
          You don&apos;t have access to this page 😅 <br />
          Try and<a href='/auth/sign-in'> sign in</a> to see it?
        </H1>
      </center>
    </FullPage>
  </div>
)
export default NotAuthorized
