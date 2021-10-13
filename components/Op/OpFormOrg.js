import { Form, Tooltip } from 'antd'
import { FormattedMessage } from 'react-intl'
import OrgSelector from '../Org/OrgSelector'
import { QuestionCircleOutlined } from '@ant-design/icons'
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
      <QuestionCircleOutlined />
    </Tooltip>
  </span>
)

export const OpFormOrg = ({ orgMembership }) =>
  orgMembership
    ? (
      <Form.Item name='offerOrg' label={opOrganisation}>
        <OrgSelector className='organisation' orgs={orgMembership} />
      </Form.Item>
      )
    : null

export default OpFormOrg
