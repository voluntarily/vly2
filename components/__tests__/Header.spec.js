import React from 'react';
import test from 'ava';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import { Header } from '../../components/Header/Header';
import { intl } from '../../../../util/react-intl-test-helper';

test('renders the header properly', t => {
  const router = {
    isActive: sinon.stub().returns(true),
  };
  const wrapper = shallow(
    <Header />,
    {
      context: {
        router,
        intl,
      },
    }
  );

  t.truthy(wrapper.find('Link').first().containsMatchingElement(<FormattedMessage id="siteTitle" />));
  // t.is(wrapper.find('a').length, 2);
});
