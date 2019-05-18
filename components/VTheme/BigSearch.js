import styled from 'styled-components'
import React from 'react'
import { Input } from 'antd'

const Search = Input.Search

const SearchContainer = styled.div`
  margin-top: 32rem;
  width: 80rem;
  height: 9rem;
  background: #ffffff;
  box-shadow: 2px 2px 12px 0 rgba(117, 117, 117, 0.5);
  border-radius: 8px;
`
const SearchInputContainer = styled.div`
  width: 79rem;
  padding-left: 1rem;
`

const SearchTitle = styled.p`
  padding-left: 1rem;
  padding-top: 1rem;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  letter-spacing: -0.5px;
  font-weight: 700;
  color: black;
`

const SearchFilterText = styled.p`
  padding-left: 1rem;
  padding-top: 1rem;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  letter-spacing: -0.5px;
  font-weight: 500;
  color: #333;
`

const BigSearchForm = styled.input``

const BigSearch = () => (
  <SearchContainer>
    <SearchTitle>Search</SearchTitle>
    <SearchInputContainer>
      <Search
        size='large'
        placeholder="try 'building robots' "
        enterButton='Search'
      />
    </SearchInputContainer>
    <SearchFilterText>Filter by:</SearchFilterText>

    <p>Potatoes</p>
    <p>Carrots</p>
    <p>Eggs</p>
    <p>Ham</p>
  </SearchContainer>
)
export default BigSearch
