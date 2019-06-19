import PropTypes from 'prop-types'

export function OpTagsContainer ({ tags }) {
  return (
    <div>
      {tags.map(tag => {
        return <div key={tag.tag}>{tag.tag}</div> // TODO: styling when designs are finalised
      })}
    </div>
  )
}

OpTagsContainer.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.shape({
    tag: PropTypes.string.isRequired,
    _id: PropTypes.string
  }))
}

export default OpTagsContainer
