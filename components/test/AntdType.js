/* AntD Typography Test
*/
import React from 'react'
import { Typography } from 'antd'

const { Paragraph, Title } = Typography

class AntdType extends React.Component {
  state = {
    str: 'This is an editable text.'
  };

  // onChange = (str) => {
  //   console.log('Content change:', str);
  //   this.setState({ str });
  // };

  render () {
    return (
      <div>
        <Title>h1. Ant Design</Title>
        <Title level={2}>h2. Paragraph features</Title>
        <Paragraph >{this.state.str}</Paragraph>
        <Paragraph copyable>This is a copyable text.</Paragraph>
        <Paragraph copyable={{ text: 'Hello, Ant Design!' }}>Replace copy text.</Paragraph>
        <p>{this.state.str}</p>
      </div>
    )
  }
}

export default AntdType
