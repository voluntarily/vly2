import { FormattedMessage } from 'react-intl'
import { message, Radio } from 'antd'
import callApi from '../../lib/callApi'
import { MemberStatus } from '../../server/api/member/member.constants'
import TextArea from 'antd/lib/input/TextArea'
import { useState } from 'react'
import {
  DescriptionContainer,
  FormGrid,
  InputContainer
} from '../VTheme/FormStyles'

export const InviteMembers = ({ org }) => {
  const [adminMsg, setAdminMsg] = useState('')

  const handleInviteMember = async e => {
    const memberStatus = e.target.value
    const memberValidation = `${org.name} Invitation`
    const url = `notify/org/${org._id}?memberStatus=${memberStatus}&memberValidation=${memberValidation}&adminMsg=${adminMsg}`
    try {
      message.loading('Sending email..', 2.5)
      await callApi(url)
      message.success('Done')
    } catch {
      message.error('There was a problem, try again later.')
      console.error('handleInviteMember', e)
    }
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
      <FormGrid>
        <DescriptionContainer>
          <p>
            <FormattedMessage
              defaultMessage={`Use these buttons to send yourself an email that 
              you can forward to people in your school or business.
              Each button will send you an email containing a link 
              that will automatically add the recipient to your 
              organisation as a follower or member. `}
              id='InviteMembers.description'
              description='inform orgAdmin how to send emails to staff'
            />
          </p>
        </DescriptionContainer>
        <InputContainer>
          <label>
            <p>
              <FormattedMessage
                defaultMessage='Add a personal message to the people you are inviting'
                id='InviteMembers.adminMessage'
                description='label for text box for admin personal message'
              />
            </p>
          </label>
          <TextArea
            value={adminMsg}
            onChange={e => setAdminMsg(e.target.value)}
          />
        </InputContainer>
        <DescriptionContainer>
          <p>
            <FormattedMessage
              defaultMessage={`Use Joiner if you want to review new members 
              before accepting them and Administrator to give 
              people permission to edit the organisation pages 
              and add new members. Once people join they will appear in the tables below.`}
              id='InviteMembers.description2'
              description='continued inform orgAdmin how to send emails to staff'
            />
          </p>
        </DescriptionContainer>
        <InputContainer>
          <label>
            <p>
              <FormattedMessage
                defaultMessage='Set membership status and send email'
                id='InviteMembers.InviteBtnPrompt'
                description='prompt for which invitation button to use'
              />
            </p>
          </label>
          <br />
          <Radio.Group
            buttonStyle='solid'
            size='large'
            onChange={handleInviteMember}
          >
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
            <Radio.Button value={MemberStatus.ORGADMIN}>
              <FormattedMessage
                defaultMessage='Administrator'
                id='InviteMembers.orgAdmin'
              />
            </Radio.Button>
          </Radio.Group>
        </InputContainer>
      </FormGrid>
    </>
  )
}

export default InviteMembers
