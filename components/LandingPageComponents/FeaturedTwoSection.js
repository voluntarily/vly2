import React from 'react'
import { HalfGrid } from '../VTheme/VTheme'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import SectionSubtitle from './SectionSubtitle'
import OpCard from '../Op/OpCard'

const FeaturedTwoSection = ({ ops, title, subtitle, ...props }) => (
  <div>
    <SectionSubtitle
      title={title}
      subtitle={subtitle}
    />
    <HalfGrid>
      {ops ? (
        ops.map((op, index) => <OpCard size='Big' op={op} key={index} />)
      ) : (
        <FormattedMessage
          id='op.list.empty'
          defaultMessage='No matching opportunities'
          description='no opportunities message in OpList'
        />
      )}
    </HalfGrid>
  </div>
)

FeaturedTwoSection.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  ops: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      subtitle: PropTypes.string,
      imgUrl: PropTypes.any,
      duration: PropTypes.string
    })
  ) // optional
}

export default FeaturedTwoSection
