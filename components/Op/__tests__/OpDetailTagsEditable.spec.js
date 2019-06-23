import React from 'react'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import OpDetailTagsEditable from '../OpDetailTagsEditable'
import sinon from 'sinon'

const originalWarn = console.warn

test.before('before test silence async-validator', () => {
  console.warn = (...args) => {
    if (typeof args[0] === 'string' && args[0].startsWith('async-validator:')) return
    originalWarn(...args)
  }
})

test.after.always(() => {
  console.warn = originalWarn
})

test('render the op with a few pre-existing tags', t => {
  const firstTag = 'java'
  const secondTag = 'network'

  const wrapper = mountWithIntl(
    <OpDetailTagsEditable value={[firstTag, secondTag]} />
  )

  t.is(wrapper.find('.ant-tag').length, 2)
  t.is(wrapper.find('.ant-tag').at(0).text(), firstTag)
  t.is(wrapper.find('.ant-tag').at(1).text(), secondTag)
})

test('render the op with a few pre-existing tags, and add a tag into the input field', t => {
  const firstTag = 'java'
  const secondTag = 'network'

  const inputTag = 'new tag!'

  const wrapper = mountWithIntl(
    <OpDetailTagsEditable value={[firstTag, secondTag]} />
  )

  t.is(wrapper.find('.ant-tag').length, 2)

  wrapper.find('input').simulate('change', { target: { value: inputTag } })

  t.true(wrapper.html().includes('new tag!'))
})

test('render the op with a few pre-existing tags, and add a tag fully, to re-render', t => {
  const firstTag = 'java'
  const secondTag = 'network'
  const inputTag = 'new tag!'

  const mockOnChange = sinon.spy()
  const value = [firstTag, secondTag]
  const expectedNewValue = [firstTag, secondTag, inputTag]

  const wrapper = mountWithIntl(
    <OpDetailTagsEditable onChange={mockOnChange} value={value} />
  )

  const wrapperInstance = wrapper.instance()

  t.is(wrapper.find('.ant-tag').length, 2)

  const inputEvent = {
    target: { value: inputTag }
  }

  wrapperInstance.updateInputValue(inputEvent)
  wrapperInstance.forceUpdate()

  const event = {
    key: 'Enter',
    keyCode: 13,
    preventDefault: () => {
    }
  }

  wrapperInstance.addTag(event)

  t.true(Object.values(wrapperInstance.state).indexOf('') === 0)
  t.true(mockOnChange.calledOnce)
  t.true(mockOnChange.calledWith(expectedNewValue))
})

test('render the op with a few pre-existing tags, and remove a tag from them', t => {
  const firstTag = 'java'
  const secondTag = 'network'
  const mockOnChange = sinon.spy()

  const wrapper = mountWithIntl(
    <OpDetailTagsEditable onChange={mockOnChange} value={[firstTag, secondTag]} />
  )

  const wrapperInstance = wrapper.instance()

  wrapperInstance.removeTag('network')

  t.true(mockOnChange.calledOnce)
  t.true(mockOnChange.calledWith([ firstTag ]))
})
