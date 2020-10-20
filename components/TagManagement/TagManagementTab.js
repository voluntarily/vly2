import { useState } from 'react'
import { Tabs, Button } from 'antd'
import VTabs from '../VTheme/VTabs'
import { TagTable } from './TagTable'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import reduxApi from '../../lib/redux/reduxApi.js'

import { TagSearch } from './TagSearch'

const SearchContainer = styled.div`
  display: inline-block;
  position: relative;
  width: auto;
  padding-bottom: 1em;
  padding-right: 1em;
`

const TagManagementTab = (props) => {
  const [searchVal, setSearchVal] = useState('')
  const [tagToAdd] = useState('')
  const dispatch = useDispatch()

  const handleSearch = (value) => {
    setSearchVal(value)
  }

  const addTag = async (value) => {
    try {
      await dispatch(reduxApi.actions.tagManagement.post({ id: value }, { tags: [value] }))
    // setTagToAdd(value)
    } catch {
      console.error('YEAH NAH for adding for tag' + value)
    }
  }

  return (
    <VTabs size='large'>
      <Tabs.TabPane tab='Tags' key={1}>
        <SearchContainer>
          <TagSearch value={searchVal} handleSearch={handleSearch} />
        </SearchContainer>
        <Button shape='round' size='default' type='primary' onClick={() => addTag(searchVal)}>
            Add Tag
        </Button>
        <TagTable searchVal={searchVal} tagToAdd={tagToAdd} aliases={props.aliases} />
      </Tabs.TabPane>
    </VTabs>
  )
}

export default TagManagementTab
