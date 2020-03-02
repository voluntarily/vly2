import PropTypes from 'prop-types'
import { TagStyle } from '../VTheme/VTheme'
import styled from 'styled-components'

const TagContainer = styled.div`
display: inline-block;
position: relative;
width: auto;

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
