/* AntD Typography Test
*/
import { Typography } from 'antd'
import React from 'react'

const { Paragraph, Title } = Typography

class AntdType extends React.Component {
  state = {
    str: 'This is an editable text.'
  }

  render () {
    return (
      <div>
        <Title>h1. Ant Design</Title>
        <Title level={2}>h2. Paragraph features</Title>
        <Paragraph>{this.state.str}</Paragraph>
        <Paragraph copyable>This is a copyable text.</Paragraph>
        <Paragraph copyable={{ text: 'Hello, Ant Design!' }}>Replace copy text.</Paragraph>
        <p>{this.state.str}</p>
      </div>
    )
  }
}

export default AntdType
