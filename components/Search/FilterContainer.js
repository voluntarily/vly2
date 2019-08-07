import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
import './filterContainerStyles.less'

// reusable component for displaying filter input components and details (passed in as children)
// generic behaviour is that a filter can be applied and cancelled
// TODO: allow this to be variable height so that it can handle having more children without overflowing
class FilterContainer extends React.Component {
  state = {
    filterApplied: false,
    filterValue: null
  }

  handleFilterValueChange = (value) => {
    this.setState({ filterValue: value })
  }

  applyFilter = () => {
    const { filterName, onFilterApplied, onClose } = this.props
    this.setState({ filterApplied: true })
    onFilterApplied(filterName, this.state.filterValue)
    onClose(filterName)
  }

  removeFilter = () => {
    const { filterName, onFilterRemoved, onClose } = this.props
    if (this.state.filterApplied) {
      this.setState({ filterApplied: false })
      onFilterRemoved(filterName)
    }
    onClose(filterName)
  }

  render () {
    const { children, isShowing, filterName } = this.props
    const cancelText = this.state.filterApplied ? 'Remove filter' : 'Cancel'
    return (
      <Modal
        title={`Filter by ${filterName}`}
        visible={isShowing} okText='Apply filter'
        cancelText={cancelText}
        onOk={this.applyFilter}
        onCancel={this.removeFilter}
      >
        <div className='filter-details-container'>
          {
            React.cloneElement(children, {
              onChange: this.handleFilterValueChange,
              value: this.state.filterValue
            })
          }
        </div>
      </Modal>
    )
  }
}

FilterContainer.propTypes = {
  onFilterRemoved: PropTypes.func.isRequired,
  onFilterApplied: PropTypes.func.isRequired,
  filterName: PropTypes.string.isRequired,
  isShowing: PropTypes.bool.isRequired,
  onClosed: PropTypes.func.isRequired
}

export default FilterContainer
