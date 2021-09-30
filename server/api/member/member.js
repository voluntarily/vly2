import mongoose from 'mongoose'
import idvalidator from 'mongoose-id-validator'
import { accessibleRecordsPlugin } from '@casl/mongoose'

import memberConstants from './member.constants.js'
const { MemberStatus } = memberConstants
const { Schema, models, model } = mongoose

const memberSchema = new Schema({
  person: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
  organisation: { type: Schema.Types.ObjectId, ref: 'Organisation', required: true },
  validation: String,
  status: {
    type: 'String',
    default: MemberStatus.FOLLOWER,
    required: true,
    enum: [
      MemberStatus.NONE,
      MemberStatus.FOLLOWER,
      MemberStatus.JOINER,
      MemberStatus.MEMBER,
      MemberStatus.VALIDATOR,
      MemberStatus.ORGADMIN,
      MemberStatus.EXMEMBER
    ]
  }
}, { timestamps: true })

/*
    State flows

    0 person clicks Follow, record is created - anyone can follow an organisation
        -> follower.
    1 person clicks join - asserts they are a member of the organisation somehow.
        fills in validation field.
        -> joiner
    2. orgadmin or system validates
        -> workflow validates - keycode or email verification, or human
        -> member  (success)
        -> follower ( failure )
    5 person leaves the group, admin removes the person
        -> exmember
    6 person unfollows the group
        -> exmember, or record removed

*/

memberSchema.plugin(idvalidator)
memberSchema.plugin(accessibleRecordsPlugin)

// protect multiple imports
var Member

if (models.Member) {
  Member = model('Member')
} else {
  Member = model('Member', memberSchema)
}
export default Member
