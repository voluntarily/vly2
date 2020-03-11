import React from 'react'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import { OpArchivedHeader } from '../OpArchivedHeader'
import { OpportunityStatus } from '../../../server/api/opportunity/opportunity.constants'

test('render OpArchivedHeader for completed op', t => {
  const wrapper = mountWithIntl(
    <OpArchivedHeader
      status={OpportunityStatus.COMPLETED}
    />
  )
  t.regex(wrapper.find('h4').text(), /already happened/)
})

test('render OpArchivedHeader for cancelled op', t => {
  const wrapper = mountWithIntl(
    <OpArchivedHeader
      status={OpportunityStatus.CANCELLED}
    />
  )
  t.regex(wrapper.find('h4').text(), /cancelled/)
})
