import PropTypes from 'prop-types'
import { TagStyle } from '../VTheme/VTheme'
import styled from 'styled-components'

const TagContainer = styled.div`
max-width: 100%;
display: block;
`

export function TagDisplay ({ tags }) {
  if (!tags) return ''
  return (
    <TagContainer>
      {tags.map(tag => {
        return <TagStyle key={tag}>{tag}</TagStyle>
      })}
    </TagContainer>
  )
}

TagDisplay.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string)
}

export default TagDisplay
