import test from 'ava'
import { mount } from 'enzyme'
import VTabs from '../VTabs'
import { Tabs } from 'antd'
const { TabPane } = Tabs
test('Check Tabs Render', t => {
  const TabCheck = mount(<VTabs><TabPane>potato</TabPane></VTabs>)
  t.true(TabCheck.exists())
})
