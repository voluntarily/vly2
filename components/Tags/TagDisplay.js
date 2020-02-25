import PropTypes from 'prop-types'
import { TagStyle } from '../VTheme/VTheme'

export function TagDisplay ({ tags }) {
  if (!tags) return ''
  return (
    <span>
      {tags.map(tag => {
        return <TagStyle key={tag}>{tag}</TagStyle>
      })}
    </span>
  )
}

TagDisplay.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string)
}

export default TagDisplay
