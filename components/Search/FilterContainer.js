import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'antd'
import { SearchContainer as DetailsContainer } from './BigSearch'
import './filterContainerStyles.less'

// intended to be a reusable component for displaying filter input components and details (passed in as children)
// generic behaviour is that a filter can be applied and cancelled
// TODO: allow this to be variable height so that it can handle having more children without overflowing
const FilterContainer = ({ children, onFilterApplied, onCancel }) => (
  <DetailsContainer className='root-container'>
    <div className='filter-details-container'>
      {children}
    </div>
    <div className='filter-details-btn-container'>
      <Button
        onClick={onFilterApplied}
        className='filter-details-btn'
        type='primary'
        shape='round' >
        <FormattedMessage
          id='op-search-apply-filter'
          defaultMessage='Filter'
          description='Button that applies a filter to search results' />
      </Button>
      <Button
        onClick={onCancel}
        className='filter-details-btn'
        type='secondary'
        shape='round' >
        <FormattedMessage
          id='op-search-cancel-filter'
          defaultMessage='Cancel'
          description='Button that removes a filter from search results' />
      </Button>
    </div>
  </DetailsContainer>
)

export default FilterContainer
