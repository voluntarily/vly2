
import Privacy from '../../assets/notices/privacy-en.md'
import { HalfGrid } from '../VTheme/VTheme'

/**
 * This page asks the person to select whether they are an asker or offerer
 */
export const AcceptPrivacy = ({ children }) =>
  <HalfGrid style={{ paddingTop: 0 }}>
    <div id='leftCol'>
      <img style={{ width: '100%' }} src='/static/img/sign-up/privacy.svg' />
    </div>
    <div id='rightCol'>
      <Privacy />
      {children}
    </div>

  </HalfGrid>
export default AcceptPrivacy
