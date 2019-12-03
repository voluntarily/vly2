import React from 'react'
import { 
  FacebookShareButton, 
  LinkedinShareButton, 
  TwitterShareButton, 
  WhatsappShareButton, 
  FacebookIcon, 
  TwitterIcon, 
  WhatsappIcon, 
  LinkedinIcon,
  EmailShareButton,
  EmailIcon } from 'react-share'

const shareLinkStyle = {
  display: 'inline-block',
  marginRight: '5px',
  cursor: 'pointer',
  outline: 'none'
}

export const ShareLinks = ({ url, op }) => (
  <div>
    <FacebookShareButton
      style={shareLinkStyle}
      url={url}
    >
      <FacebookIcon size={48} round />
    </FacebookShareButton>

    <TwitterShareButton
      style={shareLinkStyle}
      url={url}
    >
      <TwitterIcon size={48} round />
    </TwitterShareButton>

    <LinkedinShareButton
      style={shareLinkStyle}
      url={url}
    >
      <LinkedinIcon size={48} round />
    </LinkedinShareButton>

    <WhatsappShareButton
      style={shareLinkStyle}
      url={url}
    >
      <WhatsappIcon size={48} round />
    </WhatsappShareButton>

    <EmailShareButton
      style={shareLinkStyle}
      url={url}
      subject={op.name}
      >
      <EmailIcon size={48} round />
    </EmailShareButton>
  </div>
)
