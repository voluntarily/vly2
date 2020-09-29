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

const StyledButton = styled(Button)`
  margin-right: 0.5rem;
`;

const StyledInput = styled(Input);
const EditableTagCell = (props) => {
  const [editing, setEditing] = useState(false);
  const { getFieldDecorator } = props.form;
  const onFinish = (values) => {
    setEditing((editing) => false);
  };

  // TODO: Check if a tag to be submitted exists in the db
  const handleSubmit = (e) => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        setEditing(false);
        console.log("Received values of form: ", values);
      }
    });
  };


  if (!editing) {
    return (
      <TagWrapper>
        <Typography>
          {props.tag}{" "}
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
            ["tag"]: props.tag,
          }}
          onSubmit={handleSubmit}
        >
          <Form.Item name="tag">
            {getFieldDecorator("tag", {
              initialValue: props.tag,
              rules: [{ required: true, message: "Please input the tag!" }],
            })(<Input name="tag" />)}
          </Form.Item>
          <Form.Item>
            <StyledButton type="primary" htmlType="submit">
              Submit
            </StyledButton>
            <StyledButton
              type="secondary"
              onClick={(editing) => setEditing(false)}
            >
              Cancel
            </StyledButton>
          </Form.Item>
        </Form>
      </TagWrapper>
    );
  }
};

export default Form.create()(EditableTagCell);
