import styled from 'styled-components'
import React from 'react'
import { Input } from 'antd'

const Search = Input.Search

const SearchContainer = styled.div`
  margin-top: 0rem;
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
  float: left;
`

const FilterItem = styled.a`
float: left;
margin-top: 1rem;
margin-right: 0.5rem;
width: 8rem;
text-align: center;
font-weight: bold;
`

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
    <SearchFilterText>Filter by:
      
    </SearchFilterText>
    <FilterItem>Date</FilterItem>
    <FilterItem>Location</FilterItem>
    <FilterItem>Categories</FilterItem>
    <FilterItem>Impact</FilterItem>

  </SearchContainer>
)
export default BigSearch
