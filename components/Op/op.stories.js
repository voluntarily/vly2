import React from 'react'
import { storiesOf } from '@storybook/react'
import OpCard from './OpCard'
import OpList from './OpList'
import OpDetail from './OpDetail'
import { StoryIntroContainer } from '../VTheme/VStoryTheme'
import ops from './__tests__/Op.fixture'
import { withKnobs, text, number, radios, optionsKnob as options } from '@storybook/addon-knobs'

const groupId = 'GROUP-ID1'

const Com = (props) => <div>{props.value}</div>

storiesOf('Opportunity Cards', module)
  .addDecorator(withKnobs)
  .add('OpCard', () => {
    const value = number('Opportunity #', 0, { range: true, min: 0, max: ops.length, step: 1 }, groupId)
    const size = radios('Size', ['Small', 'Big'], 'Small', groupId)

    return (
      <StoryIntroContainer>
        <OpCard size={size} op={ops[value]} />
        <br /><hr /><br />
        <pre>{JSON.stringify(ops[value], null, 2)}</pre>
      </StoryIntroContainer>

    )
  })
  .add('OpList', () => (
    <div>
      <StoryIntroContainer>
        <OpList ops={ops} />
      </StoryIntroContainer>

    </div>
  ))
  .add('OpDetail', () => (
    <StoryIntroContainer>
      <OpDetail op={ops[0]} onPress={() => {}} />
    </StoryIntroContainer>

  ))
