/**
 * Components using the react-intl module require access to the intl context.
 * This is not available when mounting single components in Enzyme.
 * These helper functions aim to address that and wrap a valid,
 * English-locale intl context around them.
 */
import React from 'react'
import { IntlProvider, createIntl } from 'react-intl'
import { mount, shallow } from 'enzyme'
import messages from '../lang/en'

// You can pass your messages to the IntlProvider. Optional: remove if unneeded.
const defaultLocale = 'en'
const locale = defaultLocale

const intl = createIntl({
  locale: 'en',
  defaultLocale: 'en',
  messages
})

const nodeWithIntlProp = node => {
  return React.cloneElement(node, { intl })
}

export function mountWithIntl (node) {
  return mount(nodeWithIntlProp(node), {
    wrappingComponent: IntlProvider,
    wrappingComponentProps: {
      locale,
      defaultLocale,
      messages
    }
  })
}

export function mountWithMockIntl (node, mockMessages) {
  return mount(
    node,
    {
      wrappingComponent: IntlProvider,
      wrappingComponentProps: {
        locale,
        defaultLocale,
        messages: Object.assign({}, messages, mockMessages)
      }
    }
  )
}

export function shallowWithIntl (node) {
  return shallow(nodeWithIntlProp(node), {
    wrappingComponent: IntlProvider,
    wrappingComponentProps: {
      locale,
      defaultLocale,
      messages
    }
  })
}

export const renderWithIntl = mountWithIntl
