import PropTypes from 'prop-types'
import { TagStyle } from '../VTheme/VTheme'
import styled from 'styled-components'
import { TagDisplay } from '../Tags/TagDisplay'
import { useDispatch } from 'react-redux'
import reduxApi from '../../lib/redux/reduxApi.js'

const TagContainer = styled.div`
display: inline-block;
position: relative;
width: auto;

`

export function AliasDisplay ({ aliases, tag }) {
  const dispatch = useDispatch()
  if (!aliases) return ''
  return (
    <TagContainer>
      {aliases.map(alias => {
        return <TagStyle key={alias} closable onClose={() => onChange(alias, tag, dispatch)}>{alias}</TagStyle>
      })}
    </TagContainer>
  )
}

function onChange (alias, tag, dispatch) {
  dispatch(reduxApi.actions.aliases.delete({ id: tag }, { body: JSON.stringify({ aliasToDelete: alias }) }))
}
TagDisplay.propTypes = {
  aliases: PropTypes.arrayOf(PropTypes.string)
}

export default AliasDisplay
