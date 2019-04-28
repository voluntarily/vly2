import { Component } from 'react'
import Layout from '../components/Layout'
import Hello from '../components/test/Hello'
import LessStyled from '../components/test/LessStyled'
import AntdType from '../components/test/AntdType'
import IntlDemo from '../components/test/IntlDemo'

export default () => 
  <Layout className='a4'>
    <h1>Tests</h1>
    <Hello />
    <IntlDemo />
    <LessStyled />
    <AntdType />
  </Layout>

