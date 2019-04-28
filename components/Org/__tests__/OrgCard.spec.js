import test from 'ava';
import OrgCard from '../OrgCard';
import { shallow, mount } from 'enzyme';

const org = {
  _id: 'f34gb2bh24b24b2',
  name: 'OMGTech',
  slug: 'hello-omgtech',
  imgUrl: '/static/andrew.jpg',
  about: 'OMGTech! develops & delivers engaging workshops for both teachers and students on digital technologies and how to explore and invent with them',
  type: 'activity-provider',
};

const props = {
  org,
};

test('renders properly', t => {
  const wrapper = shallow(
    <OrgCard {...props} />
  );

  t.is(wrapper.find('Link').first().prop('children'), org.name);
  t.regex(wrapper.find('.org-about').first().text(), new RegExp(org.about));
  t.is(wrapper.find('.org-type').first().text(), org.type);
});

test('has correct props', t => {
  const wrapper = mount(
    <OrgCard {...props} />
  );

  t.deepEqual(wrapper.prop('org'), props.org);
 });

