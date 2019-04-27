import React from 'react';
import test from 'ava';
import { shallow } from 'enzyme';
import OrgList from '../../components/OrgList';

// Initial organisations added into test db
const orgs = [
  {
    cuid: 'f34gb2bh24b24b2',
    name: 'OMGTech',
    slug: 'hello-omgtech',
    about: "All cats meow 'mern!'",
    type: 'corporate',
  },
  {
    cuid: 'f34gb2bh24b24b3',
    name: 'Datacom',
    slug: 'hi-datacom',
    about: "All dogs bark 'mern!'",
    type: 'corporate',
  },
];


test('renders the list', t => {
  const wrapper = shallow(
    <OrgList orgs={orgs} handleShowOrg={() => {}} handleDeleteOrg={() => {}} />
  );

  t.is(wrapper.find('OrgListItem').length, 2);
});
