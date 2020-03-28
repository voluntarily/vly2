import { handleToken } from '../../token/token'
import { addMember } from '../../../../server/api/member/member.lib'

/* this url
http://localhost:3122/api/notify/org/5d9fe64b4eb179218c8d1d30?memberStatus=member&memberValidation=%27test%20invitation%27
generates this token
http://localhost:3122/api/notify/org/action?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJsYW5kaW5nVXJsIjoiL2FwaS9ub3RpZnkvb3JnL2FjdGlvbiIsInJlZGlyZWN0VXJsIjoiL29yZ3MvNWQ5ZmU2NGI0ZWIxNzkyMThjOGQxZDMwIiwiZGF0YSI6eyJvcmdpZCI6IjVkOWZlNjRiNGViMTc5MjE4YzhkMWQzMCIsIm9yZ0FkbWluIjp7InRlYWNoZXIiOnsicmVnaXN0cmF0aW9uIjp7InRybiI6IjMyMjk4NSIsImZpcnN0bmFtZSI6IkFkYW0gUGF1bCIsImxhc3RuYW1lIjoiV2F0a2lucyIsImNhdGVnb3J5IjoiRnVsbCIsImV4cGlyeSI6IjE1IEZlYiAyMDIyIn19LCJuaWNrbmFtZSI6ImFuZHJldyIsImFib3V0IjoiIiwibG9jYXRpb24iOiIiLCJpbWdVcmwiOiIvc3RhdGljL3VwbG9hZC9jazMycGMzczUwMDB3cWh3NThsczFjYjVhLWx1YW5hc2FsbGxlcy5qcGVnIiwicHJvbm91biI6eyJzdWJqZWN0IjoidGhleSIsIm9iamVjdCI6InRoZW0iLCJwb3NzZXNzaXZlIjoidGhlaXIifSwibGFuZ3VhZ2UiOiJlbiIsInJvbGUiOlsib3Bwb3J0dW5pdHlQcm92aWRlciIsInZvbHVudGVlciIsImFkbWluIl0sInN0YXR1cyI6ImFjdGl2ZSIsInRhZ3MiOltdLCJfaWQiOiI1ZGE1MWM1ZTc5ZTFhMDc5ZjYzOGEzNTQiLCJhdmF0YXIiOiIiLCJkYXRlQWRkZWQiOiIyMDE5LTEwLTE1VDAxOjA5OjUwLjMwOVoiLCJuYW1lIjoiYW5kcmV3QG9tZ3RlY2guY29ueiIsImVtYWlsIjoiYW5kcmV3QG9tZ3RlY2guY29ueiIsIl9fdiI6MSwicGhvbmUiOm51bGx9LCJtZW1iZXJTdGF0dXMiOiJtZW1iZXIiLCJtZW1iZXJWYWxpZGF0aW9uIjoiJ3Rlc3QgaW52aXRhdGlvbicifSwiYWN0aW9uIjoiam9pbiIsImV4cGlyZXNJbiI6IjJkIiwiaWF0IjoxNTc0Mzc1NDIyLCJleHAiOjE1NzQ1NDgyMjJ9.eVah2d5zDNYyFXRI7WhRkYOF24RKFif3sENuvl_tW-rFlJL-0Tzg3V-jLDoMS3vTex2NsamEGkf9xtLg8CjXS2gqgMQOKg6PC0iC3moCsHChvHwz7VbzYKNQ_mHFt2-ld-y8e1F7DfgVKYKpvtfmdDEHpGxRfLZHH49-RKczhKeQgN6UQeZu2REAWgBJl2P5XuQcB9GCXR6NuCXttgoHakQ2AhHPof86sGISIza18eAgtYPMbIafB1C8nUToojFM4MKB0MUuYX8dm6pMn_GpptSS0pFPXVGkXCMkRbQCi7nuzfkuJ7HGtIjeII_bxHu17b397CZV16sIq3o62yR8sg

which arrives here as
const props = {
  orgid: '5d9fe64b4eb179218c8d1d30',
  orgAdmin: {
    teacher: { registration: [Object] },
    nickname: 'andrew',
    about: '',
    location: '',
    imgUrl: '/static/upload/ck32pc3s5000wqhw58ls1cb5a-luanasallles.jpeg',
    pronoun: { subject: 'they', object: 'them', possessive: 'their' },
    language: 'en',
    role: [ 'opportunityProvider', 'volunteer', 'admin' ],
    status: 'active',
    tags: [],
    _id: '5da51c5e79e1a079f638a354',
    avatar: '',
    createdAt: '2019-10-15T01:09:50.309Z',
    name: 'andrew@omgtech.conz',
    email: 'andrew@omgtech.conz',
    __v: 1,
    phone: null
  },
  memberStatus: 'member',
  memberValidation: "'test invitation'"
}

*/
export default (req, res) => handleToken(req, res, {
  join: async props => {
    // join the signed in person to the org in the request.

    await addMember({
      person: req.session.me._id.toString(),
      organisation: props.orgid,
      validation: props.memberValidation,
      status: props.memberStatus
    })
  }
})
