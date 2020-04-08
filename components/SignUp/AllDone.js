import { FormattedMessage } from 'react-intl'
import { HalfGrid } from '../VTheme/VTheme'

export const AllDone = ({ children }) =>
  <HalfGrid>
    <div>
      <img src='/static/img/sign-up/welcome-to-voluntarily.png' />
    </div>
    <div>
      <h1>
        <FormattedMessage
          id='AllDone.title'
          defaultMessage='You are ready to go'
        />
      </h1>
      <p>
        <FormattedMessage
          id='AllDone.body'
          defaultMessage='On your home page you will see some more things to do.'
        />
      </p>
      {children}
    </div>
  </HalfGrid>
export default AllDone
