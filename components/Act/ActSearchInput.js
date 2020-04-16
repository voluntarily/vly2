
import styled from 'styled-components'
import { Input } from 'antd'

const SearchContainer = styled.div`
  background: #ffffff;
  box-shadow: 2px 2px 12px 0 rgba(117, 117, 117, 0.5);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
`

export const ActSearchInput = ({ value, onSearch, loading }) =>
  <SearchContainer>
    <Input.Search
      placeholder="Enter keywords: 'orchard', 'Wellington', 'group'..."
      // enterButton='Search'
      enterButton
      loading={loading}
      size='large'
      defaultValue={value}
      onSearch={onSearch}
      maxLength={100}
      allowClear
    />
  </SearchContainer>

export default ActSearchInput
