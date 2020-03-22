import test from 'ava'
import TeacherRegistrationRecord from '../TeacherRegistrationRecord'
import { mountWithIntl } from '../../../../lib/react-intl-test-helper'

const toasty = {
  trn: '123456',
  firstname: 'Toasty Vladimir Arthur',
  lastname: 'McToastFace',
  category: 'Full',
  expiry: '24 Dec 2021'
}

test('TeacherRegistrationRecord renders properly', t => {
  const wrapper = mountWithIntl(<TeacherRegistrationRecord trr={toasty} />)
  t.truthy(wrapper.find('li').at(0).text().includes(toasty.trn))
  t.truthy(wrapper.find('li').at(1).text().includes(`${toasty.firstname} ${toasty.lastname}`))
})
