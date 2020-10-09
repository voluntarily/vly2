import { useState } from 'react'
import { Tabs, Button } from 'antd'
import VTabs from '../VTheme/VTabs'
import { TagTable } from './TagTable'
import Link from 'next/link'
import styled from 'styled-components'

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

  const handleSearch = (value) => {
    setSearchVal(value)
  }

  return (
    <VTabs size='large'>
      <Tabs.TabPane tab='Tags' key={1}>
        <SearchContainer>
          {' '}
          <TagSearch value={[]} handleSearch={handleSearch} />
        </SearchContainer>
        <Link href=''>
          <Button shape='round' size='default' type='primary'>
            Add Tag
          </Button>
        </Link>
        <TagTable searchVal={searchVal} aliases={props.aliases} />
      </Tabs.TabPane>
    </VTabs>
  )
}

export default TagManagementTab
