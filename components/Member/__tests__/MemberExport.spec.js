import MemberExport, { createCsv } from '../MemberExport'
import React from 'react'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'

test('MemberExport button renders properly', t => {
  const wrapper = mountWithIntl(<MemberExport />)
  t.true(wrapper.find('Button').exists())
  t.is(wrapper.find('Button').first().text(), 'Export Members')
})

test('createCsv formats properly', async t => {
  const testMember = [
    {
      createdAt: '12345',
      status: 'member',
      person: {
        name: 'Jared',
        email: 'jared@jared.com',
        phone: '12345678'
      }
    }
  ]
  const csv = createCsv(testMember)

  const expected = 'data:text/csv;charset=utf-8,Name,Email,Phone,Role,CREATED_AT\nJared,jared@jared.com,12345678,member,12345'

  t.assert(csv === expected)
})

test('Click ExportMembers button', t => {
  const wrapper = mountWithIntl(<MemberExport />)
  t.true(wrapper.find('Button').exists())

  const downloadButton = wrapper.find('Button').first()
  t.is(downloadButton.text(), 'Export Members')
  downloadButton.simulate('click')
})
