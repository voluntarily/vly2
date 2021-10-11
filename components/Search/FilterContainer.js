import { Modal } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import './filterContainerStyles.css'

// reusable component for displaying filter input components and details (passed in as children)
// generic behaviour is that a filter can be applied and cancelled
// works with any filter selector provided it has value and onChange properties.
// TODO: VP-441 Improve filter flow. UX side of things is a bit iffy at the moment.
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
    const { filterName, onFilterRemoved } = this.props
    if (this.state.filterApplied) {
      this.setState({ filterApplied: false, filterValue: null })
      onFilterRemoved(filterName)
    }
    this.handleCancel()
  }

  handleCancel = () => {
    const { onClose, filterName } = this.props
    onClose(filterName)
  }

  render () {
    const { children, isShowing, filterName } = this.props
    const okText = this.state.filterApplied ? 'Remove filter' : 'Apply filter'
    return (
      <Modal
        title={`Filter by ${filterName}`}
        visible={isShowing}
        okText={okText}
        cancelText='Cancel'
        onOk={this.state.filterApplied ? this.removeFilter : this.applyFilter}
        onCancel={this.handleCancel}
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
  onClose: PropTypes.func.isRequired
}

export default FilterContainer
