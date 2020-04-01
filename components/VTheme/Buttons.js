import { Button } from 'antd'
import { FormattedMessage } from 'react-intl'

export const BackButton = ({ onClick }) =>
  <Button
    id='backBtn'
    onClick={onClick}
    shape='round'
  >
    <FormattedMessage
      id='Button.Back'
      defaultMessage='Back'
      description='Back button label'
    />
  </Button>

export const DoneButton = ({ onClick }) =>
  <Button
    id='doneBtn'
    name='done'
    shape='round'
    type='primary'
    onClick={onClick}
    // style={{ marginLeft: 8 }}
  >
    <FormattedMessage
      id='DoneBtn.label'
      defaultMessage='Done'
      description='General purpose done bytton'
    />
  </Button>

export const SaveDraftButton = ({ onClick }) =>

  <Button
    id='saveDraftBtn'
    name='save'
    shape='round'
    onClick={onClick}
  >
    <FormattedMessage
      id='OpShortForm.editSaveDraft'
      defaultMessage='Save as draft'
      description='Label for save as draft button on activity details form'
    />
  </Button>
