import { FormattedMessage } from 'react-intl'
import { HalfGrid } from '../../components/VTheme/VTheme'

export const WelcomeToVoluntarily = () =>
  <HalfGrid>
    <div>
      <img src='/static/img/sign-up/welcome-to-voluntarily.png' />
    </div>
    <div>
      <h1>
        <FormattedMessage
          id='WelcomeToVoluntarily.title'
          defaultMessage='Welcome to Voluntarily'
        />
      </h1>
      <p>
        <FormattedMessage
          id='WelcomeToVoluntarily.bodyAsk'
          defaultMessage='Need volunteers to help you out with an Activity. See what is available and ask for help.'
        />
      </p>
      <p>
        <FormattedMessage
          id='WelcomeToVoluntarily.bodyOffer'
          defaultMessage='Want to volunteer your time, or resources to help out someone in need? See what is needed and offer your skills.'
        />
      </p>
    </div>
  </HalfGrid>
export default WelcomeToVoluntarily
