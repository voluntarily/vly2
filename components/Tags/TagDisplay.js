import PropTypes from 'prop-types'
import styled from 'styled-components'

const TagStyle = styled.div`
width: auto;

padding: 0 0.5rem;
margin: 0.1rem;
display: inline-block;
position: relative;

vertical-align: middle;
font-size: 1.2rem;
font-weight: 500;

border-radius: 0.2rem;
background-color: #e8e8e8;
color: #666;
`

export function TagDisplay ({ tags }) {
  return (
    <div>
      {tags.map(tag => {
        return <TagStyle key={tag.tag}>{tag.tag}</TagStyle>
      })}
    </div>
  )
}

TagDisplay.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.shape({
    tag: PropTypes.string.isRequired,
    _id: PropTypes.string
  }))
}

export default TagDisplay
