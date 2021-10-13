import { P } from '../VTheme/VTheme'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

export const ExpandText = ({ storyBody, maxLength }) => {
  const [expand, setExpand] = useState(true)

  if (storyBody.length <= maxLength) {
    return (
      <P> {storyBody} </P>
    )
  } else {
    return (
      <P>
        {expand ? `${storyBody.substr(0, maxLength).trim()} ...` : storyBody}
        {expand
          ? (
            <a onClick={() => setExpand(false)}>
              <FormattedMessage id='readMore' defaultMessage=' read more' description='hyperlink to expand a story' />
            </a>
            )
          : (
            <a onClick={() => setExpand(true)}>
              <FormattedMessage id='readLess' defaultMessage=' read less' description='hyperlink to shrink a story' />

            </a>
            )}
      </P>
    )
  }
}
