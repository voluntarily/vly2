import React from 'react'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import { OpTypeDateTitle, OpTypeDescriptionTitle, OpTypeStamp, OpType, OpTypeCount, OpCommitment, OpTypeTitle, OpTypeImperative, OpTypeButtonLabel, OpTypeNoResults, OpTypeDescriptionPrompt, OpTypeDatePrompt, OpTypeLocationPrompt } from '../OpType'
import { OpportunityType } from '../../../server/api/opportunity/opportunity.constants'

test('render OpTypeStamp for ask op', t => {
  const wrapper = mountWithIntl(
    <OpTypeStamp
      type={OpportunityType.ASK}
    />
  )
  t.is(wrapper.find('span').length, 1)
  t.is(wrapper.find('span').text(), 'is asking for your help')
})

test('render OpType for offer op', t => {
  const wrapper = mountWithIntl(
    <OpType
      type={OpportunityType.OFFER}
    />
  )
  t.is(wrapper.text(), 'can help you')
})

test('render OpType with no type', t => {
  const wrapper = mountWithIntl(
    <OpType />
  )
  t.is(wrapper.text(), '')
})

test('render OpTypeCount for offer op', t => {
  const wrapper = mountWithIntl(
    <OpTypeCount
      counts={{ offer: 2 }}
      type={OpportunityType.OFFER}
    />
  )
  t.is(wrapper.text(), '💁🏻2 people offering to help you ')
})
test('render OpTypeCount for ask op', t => {
  const wrapper = mountWithIntl(
    <OpTypeCount
      counts={{ ask: 5 }}
      type={OpportunityType.ASK}
    />
  )
  t.is(wrapper.text(), '🙋5 people asking you for help')
})
test('render OpTypeCount with no type', t => {
  const wrapper = mountWithIntl(
    <OpTypeCount />
  )
  t.is(wrapper.text(), '')
})

test('render OpCommitment ', t => {
  const wrapper = mountWithIntl(
    <OpCommitment duration='4 hours' />
  )
  t.is(wrapper.text(), '⏱ 4 hours commitment')
})

test('render OpCommitment with no type', t => {
  const wrapper = mountWithIntl(
    <OpCommitment />
  )
  t.is(wrapper.text(), '')
})

test('render OpTypeTitle with no type', t => {
  const wrapper = mountWithIntl(
    <OpTypeTitle />
  )
  t.is(wrapper.text(), '')
})

test('render OpTypeTitle with type', t => {
  const wrapper = mountWithIntl(
    <OpTypeTitle
      type={OpportunityType.OFFER}
    />
  )
  t.is(wrapper.text(), 'Offers')
})

test('render OpTypeImperative with no type', t => {
  const wrapper = mountWithIntl(
    <OpTypeImperative />
  )
  t.is(wrapper.find('span').length, 0)
})

test('render OpTypeImperative with type', t => {
  const wrapper = mountWithIntl(
    <OpTypeImperative
      type={OpportunityType.OFFER}
    />
  )
  t.is(wrapper.text(), 'Offer to help with')
})

test('render OpTypeButtonLabel with no type', t => {
  const wrapper = mountWithIntl(
    <OpTypeButtonLabel />
  )
  t.is(wrapper.text(), '')
})

test('render OpTypeButtonLabel with type', t => {
  const wrapper = mountWithIntl(
    <OpTypeButtonLabel
      type={OpportunityType.ASK}
    />
  )
  t.is(wrapper.text(), 'Ask for help with')
})

test('render OpTypeNoResults with no type', t => {
  const wrapper = mountWithIntl(
    <OpTypeNoResults />
  )
  t.is(wrapper.text(), '')
})

test('render OpTypeNoResults with type', t => {
  const wrapper = mountWithIntl(
    <OpTypeNoResults
      type={OpportunityType.ASK}
    />
  )
  t.is(wrapper.text(), 'Waiting for someone to ask for help.')
})

test('render OpTypeDescriptionPrompt with no type', t => {
  const wrapper = mountWithIntl(
    <OpTypeDescriptionPrompt />
  )
  t.is(wrapper.text(), '')
})

test('render OpTypeDatePrompt with no type', t => {
  const wrapper = mountWithIntl(
    <OpTypeDatePrompt />
  )
  t.is(wrapper.text(), '')
})

test('render OpTypeDatePrompt with type', t => {
  const wrapper = mountWithIntl(
    <OpTypeDatePrompt
      type={OpportunityType.ASK}
    />
  )
  t.is(wrapper.text(), 'Let people know how much time you need, and if there are only a few dates you can be available.')
})

test('render OpTypeLocationPrompt with no type', t => {
  const wrapper = mountWithIntl(
    <OpTypeLocationPrompt />
  )
  t.is(wrapper.text(), '')
})

test('render OpTypeLocationPrompt with type', t => {
  const wrapper = mountWithIntl(
    <OpTypeLocationPrompt
      type={OpportunityType.ASK}
    />
  )
  t.is(wrapper.text(), 'Where do you need help? (Optional)')
})

test('render OpTypeDateTitle with no type', t => {
  const wrapper = mountWithIntl(
    <OpTypeDateTitle />
  )
  t.is(wrapper.text(), '')
})

test('render OpTypeDateTitle with type', t => {
  const wrapper = mountWithIntl(
    <OpTypeDateTitle
      type={OpportunityType.ASK}
    />
  )
  t.is(wrapper.text(), 'When do you need help? (Optional)')
})

test('render OpTypeDescriptionTitle with no type', t => {
  const wrapper = mountWithIntl(
    <OpTypeDescriptionTitle />
  )
  t.is(wrapper.text(), '')
})

test('render OpTypeDescriptionTitle with type', t => {
  const wrapper = mountWithIntl(
    <OpTypeDescriptionTitle
      type={OpportunityType.ASK}
    />
  )
  t.is(wrapper.text(), 'How do you want volunteers to help?')
})

test('render OpTypeDescriptionPrompt with type', t => {
  const wrapper = mountWithIntl(
    <OpTypeDescriptionPrompt
      type={OpportunityType.ASK}
    />
  )
  t.is(wrapper.text(), 'Is there anything specific you need help with? Let volunteers know how to help you by writing about it here')
})
