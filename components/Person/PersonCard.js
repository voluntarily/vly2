import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { Card } from 'antd'
import Markdown from 'markdown-to-jsx'
// import PersonType from './PersonType'

const PersonCard = ({ person, ...props }) => (
  <Link href={`/people/${person._id}`} >
    <Card
      cover={<img src={person.avatar} alt={person.nickname} />}
      {...props}
    >
      <Card.Meta
        title={<h1>{person.nickname}</h1>}
        description={<div><Markdown>{person.email}</Markdown><br /><small>
          {/* <ul>{person.type.map((t, index) => <PersonType key={index} personType={t} />)}</ul> */}
        </small></div>}
      />
    </Card>
  </Link>
)

PersonCard.propTypes = {
  person: PropTypes.shape({
    name: PropTypes.string.isRequired,
    nickname: PropTypes.string.isRequired,
    about: PropTypes.string.isRequired,
    // type: PropTypes.arrayOf(PropTypes.oneOf(['admin', 'op', 'vp', 'ap', 'other'])).isRequired,
    _id: PropTypes.string.isRequired
  }).isRequired
}

export default PersonCard
