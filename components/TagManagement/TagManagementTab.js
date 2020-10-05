import { useState, useEffect } from 'react'
import { Tabs, Button } from 'antd'
import VTabs from '../VTheme/VTabs'
import { TagTable } from './TagTable'
import Link from 'next/link'
import styled from 'styled-components'
import reduxApi, { withTagManagement } from '../../lib/redux/reduxApi.js'
import { useDispatch } from 'react-redux'

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
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(reduxApi.actions.aliases.get())
    dispatch(reduxApi.actions.tags.get())
  }, [])

  const handleSearch = (value) => {
    setSearchVal(value)
  }

  return (
    <VTabs size='large'>
      <Tabs.TabPane tab='Tags' key={1}>
        <SearchContainer>
          {' '}
          {/* <TagInput value={[]} existingTags={tags.data} onChange={e => console.log("Changed!!")}/>{' '} */}
          <TagSearch value={[]} handleSearch={handleSearch} />
        </SearchContainer>
        <Link href=''>
          <Button shape='round' size='default' type='primary'>
            Add Tag
          </Button>
        </Link>
        <TagTable searchVal={searchVal} />
      </Tabs.TabPane>
    </VTabs>
  )
}

export default withTagManagement(TagManagementTab)
