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
font-weight: 700;

border-radius: 0.2rem;
background-color: #e8e8e8;
color: black;

`

export function OpDetailTagsDisplay ({ tags }) {
  return (
    <div>
      {tags.map(tag => {
        return <TagStyle key={tag.tag}>{tag.tag}</TagStyle> // TODO: styling when designs are finalised
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
