import React from 'react';
import test from 'ava';
import sinon from 'sinon';
import OrgListItem from '../../components/OrgListItem/OrgListItem';
import { mountWithIntl, shallowWithIntl } from '../../../../util/react-intl-test-helper';

const org = {
  cuid: 'f34gb2bh24b24b2',
  name: 'OMGTech',
  slug: 'hello-omgtech',
  about: 'OMGTech! develops & delivers engaging workshops for both teachers and students on digital technologies and how to explore and invent with them',
  type: 'activity-provider',
};

const props = {
  org,
  onDelete: () => {},
};

test('renders properly', t => {
  const wrapper = shallowWithIntl(
    <OrgListItem {...props} />
  );

  t.truthy(wrapper.hasClass('single-org'));
  t.is(wrapper.find('Link').first().prop('children'), org.name);
  t.regex(wrapper.find('.org-about').first().text(), new RegExp(org.about));
  t.is(wrapper.find('.org-type').first().text(), org.type);
});

test('has correct props', t => {
  const wrapper = mountWithIntl(
    <OrgListItem {...props} />
  );

  t.deepEqual(wrapper.prop('org'), props.org);
  t.is(wrapper.prop('onClick'), props.onClick);
  t.is(wrapper.prop('onDelete'), props.onDelete);
});

test('calls onDelete', t => {
  const onDelete = sinon.spy();
  const wrapper = shallowWithIntl(
    <OrgListItem org={org} onDelete={onDelete} />
  );

  wrapper.find('.orgDelete').first().simulate('click');
  t.truthy(onDelete.calledOnce);
});
