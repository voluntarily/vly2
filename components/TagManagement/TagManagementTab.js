import React from 'react'
import { Tabs, Button } from 'antd'
import VTabs from '../VTheme/VTabs'
import { withOrgs } from '../../lib/redux/reduxApi.js'
import { TagTable } from './TagTable'
import TagInput from '../Form/Input/TagInput'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

const SearchContainer = styled.div`
  display: inline-block;
  position: relative;
  width: auto;
  padding-bottom: 1em;
  padding-right: 1em;
`

const TagManagementTab = (props) => {
  return (
    <VTabs size='large'>
      <Tabs.TabPane tab='Tags' key={1}>
        <SearchContainer>
          {' '}
          <TagInput />{' '}
        </SearchContainer>
        <Link href=''>
          <Button shape='round' size='default' type='primary'>
            <FormattedMessage
              defaultMessage='Add tag'
            />
          </Button>
        </Link>
        <TagTable />
      </Tabs.TabPane>
    </VTabs>
  )
}

export default withOrgs(TagManagementTab)
