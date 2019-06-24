import PropTypes from 'prop-types'

export function OpDetailTagsDisplay ({ tags }) {
  return (
    <div>
      {tags.map(tag => {
        return <div key={tag.tag}>{tag.tag}</div> // TODO: styling when designs are finalised
      })}
    </div>
  )
}

OpDetailTagsDisplay.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.shape({
    tag: PropTypes.string.isRequired,
    _id: PropTypes.string
  }))
}

export default OpDetailTagsDisplay
