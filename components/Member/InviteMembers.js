import { FormattedMessage } from 'react-intl'
import { message, Radio } from 'antd'
import callApi from '../../lib/callApi'
import { MemberStatus } from '../../server/api/member/member.constants'

export default ({ org }) => {
  const handleInviteMember = (e) => {
    console.log('handleInviteMember', e.target.value, org)
    const memberStatus = e.target.value
    const memberValidation = `${org.name} Invitation`
    const url = `notify/org/${org._id}?memberStatus=${memberStatus}&memberValidation=${memberValidation}`
    callApi(url)
    message
      .loading('Sending email..', 2.5)
  }
  return (
    <>
      <h2>
        <FormattedMessage
          defaultMessage='Invite Organisation Members'
          id='InviteMembers.title'
          description='title for invite organisation members section on orgAdmin page'
        />
      </h2>
      <p>
        <FormattedMessage
          defaultMessage='Use this button to send yourself an email that you can forward to your staff.<br />The email will contain a link that brings people to Voluntarily and automatically<br />makes them members of your organisation, placing them on your home page.'
          id='InviteMembers.description'
          description='inform orgAdmin how to send emails to staff'
        />
      </p>
      <div>
        <Radio.Group buttonStyle='solid' onChange={handleInviteMember}>
          <Radio.Button value={MemberStatus.FOLLOWER}>
            <FormattedMessage
              defaultMessage='Follower'
              id='InviteMembers.follower'
            />
          </Radio.Button>
          <Radio.Button value={MemberStatus.JOINER}>
            <FormattedMessage
              defaultMessage='Joiner'
              id='InviteMembers.joiner'
            />
          </Radio.Button>
          <Radio.Button value={MemberStatus.MEMBER}>
            <FormattedMessage
              defaultMessage='Member'
              id='InviteMembers.member'
            />
          </Radio.Button>
        </Radio.Group>
      </div>
    </>)
}
