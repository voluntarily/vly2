import React from 'react'
import { Tabs, Button } from 'antd'
import VTabs from '../VTheme/VTabs'
import { withOrgs } from '../../lib/redux/reduxApi.js'
import { TagTable } from './TagTable'
import Link from 'next/link'
import styled from 'styled-components'
import reduxApi, { withTagManagement } from '../../lib/redux/reduxApi.js'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import {TagSearch} from './TagSearch'

const SearchContainer = styled.div`
  display: inline-block;
  position: relative;
  width: auto;
  padding-bottom: 1em;
  padding-right: 1em;
`

const TagManagementTab = (props) => {
  const [aliases, tagManagement, tags] = useSelector(state => [state.aliases, state.tagManagement, state.tags])
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(reduxApi.actions.aliases.get())
    dispatch(reduxApi.actions.tags.get())

  }, [])

  return (
    <VTabs size='large'>
      <Tabs.TabPane tab='Tags' key={1}>
        <SearchContainer>
          {' '}
          {/* <TagInput value={[]} existingTags={tags.data} onChange={e => console.log("Changed!!")}/>{' '} */}
          <TagSearch value={[]}  existingTags={tags.data} />
        </SearchContainer>
        <Link href=''>
          <Button shape='round' size='default' type='primary'>
            Add Tag
          </Button>
        </Link>
        <TagTable aliases={aliases.data}/>
      </Tabs.TabPane>
    </VTabs>
  )
}

export default withTagManagement(TagManagementTab)
