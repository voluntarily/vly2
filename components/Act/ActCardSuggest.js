/*
  Display an activity record in card format with a picture, name, and commitment.
*/
import React from 'react'
import { Card } from '../VTheme/VTheme'

// todo if image is not present then use a fallback.
const ActCardSuggest = () => {
  return (
    <Card>
      <a href='https://voluntarily.atlassian.net/servicedesk/customer/portal/2/group/3/create/17' target='_blank' rel='noreferrer noopener'>
        <div>
          <img src='/static/img/activity/addActivity.png' />
        </div>
        <figcaption>
          <h1>
            Suggest a topic
          </h1>
          <p>Suggest a topic you want help with, or can offer to help with.<br /><a>Learn more</a></p>
        </figcaption>
      </a>
    </Card>
  )
}

export default ActCardSuggest
