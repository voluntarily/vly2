import React from 'react'
import { HalfGrid } from '../VTheme/VTheme'
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
      {ops
        ? (
            ops.map((op, index) => <OpCard size='Big' op={op} key={index} />)
          )
        : (
          <FormattedMessage
            id='op.list.empty2'
            defaultMessage='No matching activities'
            description='no opportunities message in OpList'
          />
          )}
    </HalfGrid>
  </div>
)

export default FeaturedTwoSection
