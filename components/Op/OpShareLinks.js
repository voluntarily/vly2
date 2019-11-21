import React from 'react'
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, WhatsappIcon, LinkedinIcon } from 'react-share'

const shareLinkStyle = {
  display: 'inline-block',
  marginRight: '5px',
  cursor: 'pointer',
  outline: 'none'
}

export const ShareLink = ({ url }) => {
  return (
    <>
      <FacebookShareButton
        style={shareLinkStyle}
        url={url}
      >
        <FacebookIcon size={32} round />
      </FacebookShareButton>

      <TwitterShareButton
        style={shareLinkStyle}
        url={url}
      >
        <TwitterIcon size={32} round />
      </TwitterShareButton>

      <LinkedinShareButton
        style={shareLinkStyle}
        url={url}
      >
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>

      <WhatsappShareButton
        style={shareLinkStyle}
        url={url}
      >
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>
    </>
  )
}
