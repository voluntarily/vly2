import { FormattedMessage } from 'react-intl'
import Navigation from '../Navigation/Navigation'

export const MenuShowState = {
  ANON: 'anon', // option shows for non signed in people
  AUTH: 'auth',
  BASIC: 'basic', // option shows for signed in people
  VOLUNTEER: 'volunteer', // option shows for signed in volunteer
  OPPORTUNITY_PROVIDER: 'opportunityProvider',
  ORG_ADMIN: 'orgAdmin',
  ADMIN: 'admin' // option shows for signed in admin
}
const { ANON, AUTH, BASIC, VOLUNTEER, OPPORTUNITY_PROVIDER, ACTIVITY_PROVIDER, RESOURCE_PROVIDER, ORG_ADMIN, ADMIN } = MenuShowState

const menuItems = [

  {
    key: 'dashboard',
    show: [AUTH, BASIC, VOLUNTEER, OPPORTUNITY_PROVIDER, ACTIVITY_PROVIDER, RESOURCE_PROVIDER, ORG_ADMIN, ADMIN],
    href: '/',
    text:
  <FormattedMessage
    id='HeaderMenu.dashboard'
    defaultMessage='Dashboard'
  />
  },
  {
    key: 'acts_ask',
    show: [ ORG_ADMIN, ADMIN],
    href: '/op',
    text:
  <FormattedMessage
    id='HeaderMenu.acts_ask'
    defaultMessage= 'My Volunteering requests'
  />
  },
  {
    key: 'acts_offer',
    show: [VOLUNTEER, BASIC, AUTH, ADMIN],
    href: '/search',
    text:
  <FormattedMessage
    id='HeaderMenu.acts_offer'
    defaultMessage='Volunteer to help'
  />
  },
  {
    key: 'acts',
    show: [ACTIVITY_PROVIDER, ORG_ADMIN, ADMIN],
    href: '/act',
    text:
  <FormattedMessage
    id='HeaderMenu.acts'
    defaultMessage='Activity ideas'
  />
  },
  {
    key: 'org',
    show: [AUTH, VOLUNTEER, BASIC, OPPORTUNITY_PROVIDER, ACTIVITY_PROVIDER, RESOURCE_PROVIDER, ORG_ADMIN, ADMIN],
    href: '/org',
    text:
  <FormattedMessage
    id='HeaderMenu.org'
    defaultMessage='Organisations'
  />
  },
  {
    key: 'admin',
    text: 'Admin',
    href: '/admin',
    show: [ADMIN]
  },
  {
    key: 'people',
    text: 'People',
    href: '/people',
    show: [ADMIN]
  },
  {
    key: 'hsignin',
    show: [ANON],
    href: '/home',
    text:
  <FormattedMessage
    id='HeaderMenu.sign-in'
    defaultMessage='Sign in'
  />
  },
  {
    key: 'hsignoff',
    show: [AUTH, VOLUNTEER, BASIC, OPPORTUNITY_PROVIDER, ACTIVITY_PROVIDER, RESOURCE_PROVIDER, ORG_ADMIN, ADMIN],
    href: '/auth/sign-off',
    text:
  <FormattedMessage
    id='HeaderMenu.sign-out'
    defaultMessage='Sign out'
  />
  }
]

const filterMenu = (state) => menuItems.filter(l => l.show.includes(state))
export const HeaderMenu = ({ state }) =>
  <Navigation items={filterMenu(state)} />

export default HeaderMenu
