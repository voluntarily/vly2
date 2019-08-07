import styled from 'styled-components'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

const SearchContainer = styled.div`
  position: fixed;
  z-index: 9;
  margin-top: -2.5rem;
  top: 6rem;
  width: 100vw;
  height: 5rem;
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
  margin-top: 1.8rem;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  letter-spacing: -0.5px;
  font-weight: 700;
  color: #333;
  float: left;
`

const FilterItem = styled.a`
  float: left;
  margin-top: 1.8rem;
  margin-right: 0.5rem;
  padding: 0 1rem;
  text-align: center;
  font-weight: bold;
`

class HeaderSearch extends PureComponent {
  render () {
    const { filterNames, onFilterOpened } = this.props
    return (
      <SearchContainer>
        <SearchFilterText>Filter by:</SearchFilterText>
        {filterNames.map(filter => <FilterItem onClick={() => onFilterOpened(filter)}>
          {/* TODO: capitalise first letter */}
          {filter}
        </FilterItem>)}
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
  ),
  filterNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  onFilterOpened: PropTypes.func.isRequired
  //  showAddOp: PropTypes.bool.isRequired,
  // dispatch: PropTypes.func.isRequired
}

export default HeaderSearch
