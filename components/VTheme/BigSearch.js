import { Input } from 'antd'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

const Search = Input.Search

const SearchContainer = styled.div`
  margin-top: 0rem;
  width: 80rem;
  height: 10rem;
  background: #ffffff;
  box-shadow: 2px 2px 12px 0 rgba(117, 117, 117, 0.5);
  border-radius: 8px;

  @media screen and (min-width: 768px) and (max-width: 1280px) {
    width: calc(100vw - 4rem);
  }

  @media screen and (max-width: 767px) {
    width: calc(100vw - 2rem);
    height: 12rem;
  }


`
const SearchInputContainer = styled.div`
  width: 79rem;
  padding-left: 1rem;

  @media screen and (min-width: 768px) and (max-width: 1280px) {
    width: calc(100vw - 6rem);
  }

  @media screen and (max-width: 767px) {
    width: calc(100vw - 4rem);
  }
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

class BigSearch extends PureComponent {
  render () {
    const { onSearch, search, onClickDateFilter } = this.props
    return (<SearchContainer>
      <SearchTitle>Search</SearchTitle>
      <SearchInputContainer>
        <Search
          size='large'
          placeholder="try 'building robots' "
          enterButton='Search'
          defaultValue={search}
          onSearch={onSearch}
        />
      </SearchInputContainer>
      <SearchFilterText>Filter by:</SearchFilterText>
      <FilterItem onClick={e => onClickDateFilter()}>Date</FilterItem>
      <FilterItem>Location</FilterItem>
      <FilterItem>Categories</FilterItem>
      <FilterItem>Impact</FilterItem>
    </SearchContainer>)
  }
}

BigSearch.propTypes = {
  search: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
  ops: PropTypes.arrayOf(
    PropTypes.shape({
      query: PropTypes.string
    })
  )
  //  showAddOp: PropTypes.bool.isRequired,
  // dispatch: PropTypes.func.isRequired
}

export default BigSearch
