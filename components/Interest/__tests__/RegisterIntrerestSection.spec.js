import RegisterIntrestSection from '../RegisterInterestSection'
import test from 'ava'
import people from '../../../server/api/person/__tests__/person.fixture'
import sinon from 'sinon'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import RegisterInterestSection from '../RegisterInterestSection';


//Initial oppotunity to be added into the test db
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
const insterests=  [
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
    }
   ] 

   const invitedAndrew = {
       _id: interestid,
       person: people[0],
       opportunity:ops[0],
       comment:"I'm Andrew",
       status: 'intrested'
   }
   const declinedAndrew = {
       _id:interestid,
       person:person[0],
       opportunity:ops[0],
       comment: "I'm Andrew",
       status: 'declined'
   }
   const initStore = {
       interests: {
           loading:false,
           data:[]
       }
   }

   function sleep (ms) {
       return new Promise(resove => setTimeout(resolve, ms))
   }


   test
   //Test the change of status when teacher/Op creator invites  
   //Test the change of status when teacher/Op creator decline 
   //test 