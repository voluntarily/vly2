import React from 'react'
import test from 'ava'
import sinon from 'sinon'
import { FormattedMessage } from 'react-intl'
import { OrgCreateWidget } from '../../components/OrgCreateWidget/OrgCreateWidget'
import { mountWithIntl, shallowWithIntl } from '../../../../util/react-intl-test-helper'

const props = {
  addOrg: () => {},
  cancelOrg: () => {}
}

test('renders properly', t => {
  const wrapper = shallowWithIntl(
    <OrgCreateWidget {...props} />
  )

  t.truthy(wrapper.hasClass('form'))
  // t.truthy(wrapper.hasClass('appear'));
  t.truthy(wrapper.find('h2').first().containsMatchingElement(<FormattedMessage id='createNewOrg' />))
  t.is(wrapper.find('input').length, 2)
//  t.is(wrapper.find('textarea').length, 1);
})

test('has correct props', t => {
  const wrapper = mountWithIntl(
    <OrgCreateWidget {...props} />
  )

  t.is(wrapper.prop('addOrg'), props.addOrg)
  t.is(wrapper.prop('cancelOrg'), props.cancelOrg)
//  t.is(wrapper.prop('showAddOrg'), props.showAddOrg);
})

test('calls addOrg', t => {
  const addOrg = sinon.spy()
  const cancelOrg = sinon.spy()

  const wrapper = mountWithIntl(
    <OrgCreateWidget addOrg={addOrg} cancelOrg={cancelOrg} value='admin' />
  )

  wrapper.ref('name').value = 'Test Organisation'
  wrapper.ref('about').value = 'Some About'
  // TODO work out how to set the select item from the tester
  //  wrapper.ref('type').value = 'tester';
  wrapper.find('button.submitOrg').first().simulate('click')
  // console.log(addOrg.args);
  t.truthy(addOrg.calledOnce)
  t.truthy(addOrg.calledWith('Test Organisation', 'Some About', 'corporate'))
})

test('empty form doesn\'t call addOrg', t => {
  const addOrg = sinon.spy()
  const cancelOrg = sinon.spy()

  const wrapper = mountWithIntl(
    <OrgCreateWidget addOrg={addOrg} cancelOrg={cancelOrg} />
  )

  wrapper.find('button.submitOrg').first().simulate('click')
  t.falsy(addOrg.calledOnce)
})

test('Cancel form calls canceOrg', t => {
  const cancelOrg = sinon.spy()
  const addOrg = sinon.spy()
  const wrapper = mountWithIntl(
    <OrgCreateWidget addOrg={addOrg} cancelOrg={cancelOrg} />
  )

  wrapper.find('button.cancelOrg').first().simulate('click')
  t.falsy(addOrg.called)
  t.truthy(cancelOrg.called)
})
