import { Form, Icon, Input, Tooltip } from 'antd'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import ImageUpload from '../Upload/ImageUpload'
import { DescriptionContainer, FormGrid, InputContainer, MediumInputContainer, TitleContainer } from '../VTheme/FormStyles'
import { QuestionCircleOutlined } from '@ant-design/icons'
const opImgUrl = (
  <span>
    <FormattedMessage
      id='OpShortForm.ImgUrl'
      defaultMessage='Image Link'
      description='activity Image URL label in OpAskForm Form'
    />
    &nbsp;
    <Tooltip title="Choose something interesting like 'we want to build robots' ">
      <QuestionCircleOutlined />
    </Tooltip>
  </span>
)

export const OpFormImg = ({ getFieldDecorator, imgUrl }) =>
  <FormGrid>
    <DescriptionContainer>
      <TitleContainer>
        <h3>
          <FormattedMessage
            id='OpShortForm.AskForm.sectionTitle.addImage'
            defaultMessage='Add an image'
            description='Title for photo upload section'
          />
        </h3>
      </TitleContainer>
      <p>
        <FormattedMessage
          id='OpShortForm.AskForm.sectionPrompt.addImage'
          defaultMessage='Requests with photos get more responses. Upload or link to a picture that represents this activity.'
          description='Prompt for photo upload section'
        />

      </p>
      <img
        style={{ width: '50%', float: 'right' }}
        src={imgUrl}
        alt='current image'
      />
    </DescriptionContainer>
    <InputContainer>
      <MediumInputContainer>
        <Form.Item label={opImgUrl}>
          {getFieldDecorator('imgUrl', {
            rules: [{ required: this.state.requiredForPublish, message: 'Please upload an image' }]
          })(
            <Input />)}
          <ImageUpload setImgUrl={this.setImgUrl} />
        </Form.Item>
      </MediumInputContainer>
    </InputContainer>
  </FormGrid>
