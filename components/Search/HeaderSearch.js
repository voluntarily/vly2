import styled from 'styled-components'
import React, { PureComponent } from 'react'
import { Input } from 'antd'
import PropTypes from 'prop-types'

const Search = Input.Search

const SearchContainer = styled.div`
position: fixed;
z-index: 100;
  margin-top: 0rem;
  width: 100vw;
  height: 6rem;
  background: #ffffff;
  box-shadow: 1px 1px 12px 0 rgba(0, 0, 0, 0.1);
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
  padding-top: 3rem;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  letter-spacing: -0.5px;
  font-weight: 700;
  color: black;
`

const SearchFilterText = styled.p`
  padding-left: 1rem;
  margin-top: 3.5rem;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  letter-spacing: -0.5px;
  font-weight: 500;
  color: #333;
  float: left;
`

const FilterItem = styled.a`
  float: left;
  margin-top: 3.5rem;
  margin-right: 0.5rem;
  width: 8rem;
  text-align: center;
  font-weight: bold;
`

class HeaderSearch extends PureComponent {
  render () {
    const { onSearch, search, onClickDateFilter } = this.props
    return (<SearchContainer>


      <SearchFilterText>Filter by:</SearchFilterText>
      <FilterItem onClick={e => onClickDateFilter()}>Date</FilterItem>
      <FilterItem>Location</FilterItem>
      <FilterItem>Categories</FilterItem>
      <FilterItem>Impact</FilterItem>
    </SearchContainer>)
  }
}

HeaderSearch.propTypes = {
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

export default HeaderSearch
