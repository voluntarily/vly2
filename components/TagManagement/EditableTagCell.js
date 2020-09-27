import { Icon, Typography, Input, Form, Button } from "antd";
import React, { useState, useRef, useEffect } from "react";
import AliasDisplay from "./AliasDisplay";
import styled from "styled-components";

const TagWrapper = styled.div`
  display: inline-block;
`;
const StyledIcon = styled(Icon)`
  font-size: 1rem;
  margin-right: 0.5rem;
  &:hover {
    color: #6549aa;
    font-size: 1.2rem;
  }
`;
const StyledInput = styled(Input);
export const EditableTagCell = ({ tag }) => {
  const [editing, setEditing] = useState(false);
  const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

  const onFinish = (values) => {
    setEditing(editing => false)
  };

  const tagError = isFieldTouched('tag') && getFieldError('tag');

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  if (!editing) {
    return (
      <TagWrapper>
        <Typography>
          {tag}{" "}
          <StyledIcon
            type="edit"
            onClick={() => setEditing((editing) => true)}
          />
        </Typography>
      </TagWrapper>
    );
  } else {
    return (
      <TagWrapper>
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          onSubmit={onFinish}
        >
          <Form.Item 
            name="tag"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input/>
          </Form.Item>
          <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
        </Form>
      </TagWrapper>
    );
  }
};
