import React from 'react';
import test from 'ava';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { Footer } from '../../components/Footer/Footer';
import { intl } from '../../../../util/react-intl-test-helper';

const intlProp = { ...intl, enabledLanguages: ['en', 'mi'] };

test('renders the footer properly', t => {
  const router = {
    isActive: sinon.stub().returns(true),
  };

  intlProp.locale = 'en';
  const switchlang = sinon.spy();

  const wrapper = shallow(
    <Footer switchLanguage={switchlang} intl={intlProp} />,
    {
      context: {
        router,
        intl,
      },
    }
  );

  t.is(wrapper.find('span').length, 1);
  t.is(wrapper.find('span').first().text(), '© 2019 · Voluntari.ly');

  // there should be a language switcher menu
  t.is(wrapper.find('li').length, 3);
  // default lang should be en
  // t.is(wrapper.find('li').first().text(), 'Switch Language');
  t.is(wrapper.find('li').at(1).text(), 'en');
  t.truthy(wrapper.find('li').at(1).hasClass('selected'));

  // click on mi
  t.is(wrapper.find('li').at(2).text(), 'mi');
  wrapper.find('li').at(2).simulate('click');
  t.truthy(switchlang.calledOnce);
  t.truthy(switchlang.calledWith('mi'));
});

// test the language switcher
// shows a menu of languages, when clicked locale is changed and selected item updates.
test('language switcher', t => {
  const router = {
    isActive: sinon.stub().returns(true),
  };
  intlProp.locale = 'en';
  const switchLang = (lang) => {
    intlProp.locale = lang;
  };
  const wrapper = shallow(
    <Footer switchLanguage={switchLang} intl={intlProp} />,
    {
      context: {
        router,
        intl,
      },
    }
  );
  wrapper.find('li').at(2).simulate('click');
  wrapper.setProps({ intl: intlProp });
  t.truthy(wrapper.find('li').at(2).hasClass('selected'));
});
