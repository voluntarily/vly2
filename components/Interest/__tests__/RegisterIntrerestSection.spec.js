import RegisterIntrestSection from '../RegisterInterestSection'
import test from 'ava'
import people from '../../../server/api/person/__tests__/person.fixture'
import sinon from 'sinon'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import RegisterInterestSection from '../RegisterInterestSection';


//Initial oppotunity to be added into the test 
const opid = '5cc903e5f94141437622cea7'
const ops = [
    {
     
    _id: opid,
    title: 'Growing in the garden',
    subtitle: 'Growing digitally in the garden',
    imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
    description: 'Project to grow something in the garden',
    duration: '15 Minutes',
    location: 'Newmarket, Auckland',
    tags: [],
    status: 'active'
    }
]

const interestid = '5cc903e5f94141437622cea8'
const insterest =  [
    {
      _id: interestid,
      person: people[0],
      opportunity: ops[0],
      comment: "I'm Andrew",
      status: null
    },
    {
      _id: interestid,
      person: people[0],
      opportunity: ops[0],
      comment: "I'm Andrew",
      status: 'interested'
    },
    {
      _id: interestid,
      person: people[0],
      opportunity: ops[0],
      comment: "I'm Andrew",
      status: 'invited'
    },
    {
      _id: interestid,
      person: people[0],
      opportunity: ops[0],
      comment: "I'm Andrew",
      status: 'committed'
    },
    {
      _id: interestid,
      person: people[0],
      opportunity: ops[0],
      comment: "I'm Andrew",
      status: 'completed'
      },
    {
      _id: interestid,
      person: people[0],
      opportunity: ops[0],
      comment: "I'm Andrew",
      status: 'cancelled'
      }
  ]
  
  test('initial state', t => {
    const changeStatus = sinon.fake()
    const withdraw = sinon.fake()
  
    const wrapper = mountWithIntl(<RegisterInterestSection
      interest={interests[0]}
      onChangeStatus={changeStatus}
      onWithdraw={withdraw}
    />)
    t.is(wrapper.find('button').text(), "I'm Interested")

  })