
import test from 'ava'
import IntlDemo from '../IntlDemo'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import { mountWithIntl as mountWithIntlMi } from '../../../lib/react-intl-test-helper-mi'

test('verify that plain input is translated EN', t => {
  const wrapper = mountWithIntl(
    <IntlDemo />
  )
  t.is(wrapper.find('span').first().text(), 'Replace in translation with Hello World!')
  t.is(wrapper.find('span').at(1).text(), '1,000')
})

test('verify that plain input is translated MI', t => {
  const wrapper = mountWithIntlMi(
    <IntlDemo />
  )

  t.is(wrapper.find('span').first().text(), 'He Tāngata')
  t.is(wrapper.find('span').at(1).text(), '1,000')
})
