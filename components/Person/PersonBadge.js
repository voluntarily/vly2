import React, { useEffect, useState } from 'react'
import { withPeople } from '../../lib/redux/reduxApi'
import { config } from '../../config/config'

const getBadgeData = async ({ _id }, setUserBadge) => {
  const response = await window.fetch(`${config.appUrl}/api/badge/${_id}`)
  const data = await response.json()
  setUserBadge(data)
}

function PersonBadge ({ person }) {
  const [userBadge, setUserBadge] = useState([{}])
  useEffect(() => {
    getBadgeData(person, setUserBadge)
  }, [person])

  return (
    <div>
      {
        userBadge.map((badge, key) => {
          return (
            <blockquote key={key} class='badgr-badge'>
              <a href={`https://api.badgr.io/public/assertions/${badge.entityId}`} target='_blank'>
                <img width='60px' height='60px' src={`${badge.badgeclassOpenBadgeId}/image?type=png`} />
              </a>
            </blockquote>)
        })
      }
    </div>
  )
}

export const PersonBadgeSection = PersonBadge
