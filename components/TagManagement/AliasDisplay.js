import PropTypes from 'prop-types'
import { TagStyle } from '../VTheme/VTheme'
import styled from 'styled-components'
import {TagDisplay} from "../Tags/TagDisplay";
import { Icon } from 'antd'


const TagContainer = styled.div`
display: inline-block;
position: relative;
width: auto;

`

export function AliasDisplay ({ tags }) {
  if (!tags) return ''
  return (
    <TagContainer>
      {tags.map(tag => {
        return <TagStyle key={tag} closable onClose={()=>onChange()}>{tag}</TagStyle>
      })}
    </TagContainer>
  )
}
function onChange() {
  console.log("On change triggered")
}
TagDisplay.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string)
}

export default AliasDisplay
