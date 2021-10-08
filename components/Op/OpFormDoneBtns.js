import { FormattedMessage } from 'react-intl'
import { BackButton, DoneButton, SaveDraftButton } from '../VTheme/Buttons'
import { DescriptionContainer, FormGrid, InputContainer, TitleContainer } from '../VTheme/FormStyles'

export const OpFormDoneBtns = ({ type, onCancel, showPrompt = false, canSaveDraft = false, onSaveDraft }) =>
  <FormGrid>

    <DescriptionContainer>
      {showPrompt &&
        <>
          <TitleContainer>
            <h3>
              <FormattedMessage
                id='OpFormDoneBtns.sectiontitle.ConfirmRequest'
                defaultMessage='Confirm request'
                description='Section title for the save and publish buttons'
              />
            </h3>
          </TitleContainer>
          <p>
            <FormattedMessage
              id='OpFormDoneBtns.SaveInstructions'
              defaultMessage='Save as Draft will allow you to preview the request while Publish will make it available to everyone to view.'
              description='Instructions for save and publish on activity details form'
            />
          </p>
        </>}
    </DescriptionContainer>
    <InputContainer>
      <BackButton onClick={onCancel} />&nbsp;&nbsp;
      <DoneButton
        type='primary'
        htmlType='submit'
      />&nbsp;
      {canSaveDraft &&
        <SaveDraftButton
          htmlType='submit'
          onClick={onSaveDraft}
        />}
    </InputContainer>
  </FormGrid>

export default OpFormDoneBtns
