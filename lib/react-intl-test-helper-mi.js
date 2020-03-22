/**
 * Components using the react-intl module require access to the intl context.
 * This is not available when mounting single components in Enzyme.
 * These helper functions aim to address that and wrap a valid,
 * English-locale intl context around them.
 */

import { IntlProvider } from 'react-intl'
import { mount, shallow, render } from 'enzyme'

// You can pass your messages to the IntlProvider. Optional: remove if unneeded.
import messages from '../lang/mi'
// You can pass your messages to the IntlProvider. Optional: remove if unneeded.
const defaultLocale = 'mi'
const locale = defaultLocale

export function mountWithIntl (node) {
  return mount(node, {
    wrappingComponent: IntlProvider,
    wrappingComponentProps: {
      locale,
      defaultLocale,
      messages
    }
  })
}

export function shallowWithIntl (node) {
  return shallow(node, {
    wrappingComponent: IntlProvider,
    wrappingComponentProps: {
      locale,
      defaultLocale,
      messages
    }
  })
}
export function renderWithIntl (node) {
  return render(node, {
    wrappingComponent: IntlProvider,
    wrappingComponentProps: {
      locale,
      defaultLocale,
      messages
    }
  })
}
