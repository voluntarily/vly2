import React from 'react'
import { FormattedMessage } from 'react-intl'
import { PBold } from '../VTheme/VTheme'
import OpTypeSelector from '../Form/Input/TypeOpSelector'
import styled from 'styled-components'

const TypeFilterContainer = styled.div`
  display: flex;
  flex-direction: column;

  > * {
      padding: 10px;
  }
`
function TypeFilter ({ onChange, value, opTypes }) {
  return (
    <TypeFilterContainer>
      <PBold>
        <FormattedMessage
          id='op.TypeFilterDescription'
          defaultMessage='Search by type...'
          description='Text that describes what the type filter does'
        />
      </PBold>
      <OpTypeSelector onChange={onChange} value={value} width='100%' opTypes={opTypes} />
    </TypeFilterContainer>
  )
}

export default TypeFilter
