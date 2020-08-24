// import React from 'react'
// import test from 'ava'
// import { shallowWithIntl } from '../../../lib/react-intl-test-helper'
// import acts from '../../../server/api/activity/__tests__/activity.fixture'
// import objectid from 'objectid'

// import ActMenu from '../ActMenu'

// test.before('Setup fixtures', (t) => {
//   // not using mongo or server here so faking ids
//   acts.map(p => { p._id = objectid().toString() })
//   t.context.acts = acts
// })

// test('render the activity menu headers', t => {
//   const wrapper = shallowWithIntl(<ActMenu acts={t.context.acts} />)
//   t.true(wrapper.exists('.ant-menu-item-group-title'))
//   t.is(wrapper.find('li').length, 3)
// })
