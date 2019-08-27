import React from 'react'

import { storiesOf } from '@storybook/react'
import OpCard from './OpCard'
import OpList from './OpList'
import moment from 'moment'

const todayDate = moment().toDate()

//for OpCard
const demoOp = {
  imgUrl: 'https://media.giphy.com/media/ZjUjG4xgRiSOc/giphy-downsized.gif',
  title: 'This is a test title',
  subtitle: 'test subtitle',
  duration: 'test duration',
  date: [todayDate],
  _id: '1'
}

// for OpList
const demoOpList = {

}




storiesOf('Opportunity Cards', module)
.add('Default Small', () => (
  <OpCard size='Small' op={demoOp} key='1' />
))
.add('Default Small List', () => (
<div>
    <OpList ops={demoOpList}></OpList>
    </div>
))