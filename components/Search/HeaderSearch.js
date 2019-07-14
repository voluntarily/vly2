import styled from 'styled-components'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

const SearchContainer = styled.div`
  position: fixed;
  z-index: 100;
  margin-top: 0rem;
  width: 100vw;
  height: 7rem;
  background: #ffffff;
  box-shadow: 1px 1px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 8px;

  @media screen and (min-width: 768px) and (max-width: 1280px) {
  }

  @media screen and (max-width: 767px) {
  }
`

const SearchFilterText = styled.p`
  padding-left: 1rem;
  padding-right: 1rem;
  margin-top: 4.4rem;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  letter-spacing: -0.5px;
  font-weight: 700;
  color: #333;
  float: left;
`

const FilterItem = styled.a`
  float: left;
  margin-top: 4.4rem;
  margin-right: 0.5rem;
  padding: 0 1rem;
  text-align: center;
  font-weight: bold;
`

class HeaderSearch extends PureComponent {
  render () {
    const { onClickDateFilter } = this.props
    return (
      <SearchContainer>
        <SearchFilterText>Filter by:</SearchFilterText>
        <FilterItem onClick={e => onClickDateFilter()}>Date</FilterItem>
        <FilterItem>Location</FilterItem>
      </SearchContainer>
    )
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
