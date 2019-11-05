import React, { useEffect, useState } from 'react'
import apiCaller from '../../lib/apiCaller'
import styled from 'styled-components'
import { config } from '../../config/config'

const BadgeWrapper = styled.div`
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  `

const Badge = styled.div`
    margin: 10px;
  `

const getBadgeData = async ({ _id }, setUserBadge) => {
  const data = await apiCaller(`badge/${_id}`)
  setUserBadge(data)
}

function PersonBadge ({ person }) {
  const [userBadge, setUserBadge] = useState(null)
  useEffect(() => {
    getBadgeData(person, setUserBadge)
  }, [person])
  // TODO: Replace badge._id with badge.name in <Badge title> and <img alt>
  return userBadge ? (
    <BadgeWrapper>
      {
        userBadge.map((badge) => {
          return (
            <Badge key={badge._id} title={badge._id}>
              <a href={`${config.BADGR_API}/public/assertions/${badge.entityId}`} rel='noopener noreferrer' target='_blank'>
                <img width='60px' height='60px' alt={`${badge._id} badge`} src={`${badge.badgeclassOpenBadgeId}/image?type=png`} />
              </a>
            </Badge>)
        })
      }
    </BadgeWrapper>
  ) : null
}

export const PersonBadgeSection = PersonBadge
