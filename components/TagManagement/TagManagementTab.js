import React, { useEffect } from 'react'
import { Tabs } from 'antd'
import VTabs from '../VTheme/VTabs'
import { withOrgs } from '../../lib/redux/reduxApi.js'
import ItemList from '../VTheme/ItemList'
import { useSelector, useDispatch } from 'react-redux'
import { TagTable } from './TagTable'
import TagInput from '../Form/Input/TagInput'

const TagManagementTab = (props) => {
 
  return (
    <VTabs size='large'>
        <Tabs.TabPane tab={"Tags"} key={1}>
            <TagInput/>
            <TagTable />
        </Tabs.TabPane>
        <Tabs.TabPane tab={"Tag Groups"} key={2}>
            <h1>Test</h1>
        </Tabs.TabPane>
    </VTabs>
  )
}

export default withOrgs(TagManagementTab)
