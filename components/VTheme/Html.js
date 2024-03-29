/* This component allows an HTML string to be displayed
 in a react page.
 The html should be sanitised
 */
import styled from 'styled-components'
import { useState } from 'react'
import { Button } from 'antd'
import { FormattedMessage } from 'react-intl'

export const Html = ({ className, children }) =>
  <div className={className} dangerouslySetInnerHTML={{ __html: children }} />

export const HtmlExpander = styled(Html)`
  max-height: ${props => props.more ? 'none' : '6.6rem'};
  word-wrap: break-word;
  overflow: hidden;
`

export const MoreOrLessButton = ({ more, onClick }) =>
  <Button shape='round' size='large' style={{ float: 'left', marginTop: '1rem' }} onClick={onClick}>
    {more
      ? (
        <FormattedMessage
          id='MoreOrLessButton.Less'
          defaultMessage='Close'
        />
        )
      : (
        <FormattedMessage
          id='MoreOrLessButton.More'
          defaultMessage='Learn more'
        />)}
  </Button>

export const HtmlMore = ({ children }) => {
  const [more, setMore] = useState(false)
  return (
    <>
      <HtmlExpander more={more}>
        {children}
      </HtmlExpander>
      <MoreOrLessButton more={more} onClick={() => setMore(!more)} />
    </>
  )
}
export default Html
