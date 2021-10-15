/*
  Display an activity record in card format with a picture, name, and commitment.
*/
import React from 'react'
import { Card } from '../VTheme/VTheme'
import Image from 'next/image'
// todo if image is not present then use a fallback.
const ActCardSuggest = () => {
  return (
    <Card>
      <a href='https://support.voluntarily.nz/hc/en-nz/requests/new?ticket_form_id=360003338774' target='_blank' rel='noreferrer noopener'>
        <div>
          <Image alt='add activity' width='296' height='160' src='/static/img/activity/addActivity.png' />
        </div>
        <figcaption>
          <h1>
            Suggest a topic
          </h1>
          <p>Suggest a topic you want help with, or can offer to help with.</p>
        </figcaption>
      </a>
    </Card>
  )
}

export default ActCardSuggest
