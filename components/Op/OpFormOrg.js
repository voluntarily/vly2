import { Form, Icon, Tooltip } from 'antd'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import OrgSelector from '../Org/OrgSelector'

const opOrganisation = (
  <span>
    {' '}
    <FormattedMessage
      id='OpAskForm.Organisation'
      defaultMessage='Group'
      description='label for Organisation offering the activity'
    />
    &nbsp;
    <Tooltip title='Select Voluntarily, or another group you belong to'>
      <Icon type='question-circle-o' />
    </Tooltip>
  </span>
)

export const OpFormOrg = ({ getFieldDecorator, orgMembership }) =>
  <>
    {orgMembership && (
      <Form.Item label={opOrganisation}>
        {getFieldDecorator('offerOrg')(
          <OrgSelector className='organisation' orgs={orgMembership} />
        )}
      </Form.Item>
    )}
  </>

export default OpFormOrg
