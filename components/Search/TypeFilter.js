import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { PBold } from '../VTheme/VTheme'
import OpTypeSelector from '../Form/Input/TypeOpSelector'
import './locationFilterStyles.less'

function TypeFilter ({ onChange, value, opTypes }) {
  return (
    <div className='location-filter-container'>
      <PBold>
        <FormattedMessage
          id='op.TypeFilterDescription'
          defaultMessage='Search by type...'
          description='Text that describes what the type filter does'
        />
      </PBold>
      <OpTypeSelector onChange={onChange} value={value} width='100%' opTypes={opTypes} />
    </div>
  )
}

TypeFilter.propTypes = {
  value: PropTypes.string,
  opTypes: PropTypes.array.isRequired,
  onChange: PropTypes.func
}

export default TypeFilter
