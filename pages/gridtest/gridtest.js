import { Button, Col, Input, Row, Divider } from 'antd'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import Container from '../../components/TestContainer/Container'
import Link from 'next/link'
import publicPage, { FullPage } from '../../hocs/publicPage'

// import OpListSection from '../../components/Op/OpListSection'
import OpListSection from '../../components/Op/OpListSection'
import styles from './grids.less'


import styled from 'styled-components'
import AwesomeCard from '../../components/TestContainer/AwesomeCard/awesomeCard';
const Search = Input.Search

export class gridtest extends Component {
  render () {
      return (
      <div>
      {/* Start HTML */}

 
          {/*  Grid responsive test */}
          <Container>

            </Container>
            <div className="fourColumnGrid"> 
              <div className="testPotatoCard">aaaaa</div>
              <div className="testPotatoCard">aaaa</div>
              <div className="testPotatoCard">aaaaaaa</div>
              <div className="testPotatoCard">aaaa</div>

              <div className="testPotatoCard">aaaaa</div>
              <div className="testPotatoCard">aaaa</div>
              <div className="testPotatoCard">aaaa</div>
              <div className="testPotatoCard">aaaa</div>

              <div className="testPotatoCard">aaaa</div>
              <div className="testPotatoCard">aaaa</div>
              <div className="testPotatoCard">aaaa</div>
              <div className="testPotatoCard">aaaa</div>

              <div className="testPotatoCard">aaaaa</div>
              <div className="testPotatoCard">aaaa</div>
              <div className="testPotatoCard">aaaaaaa</div>
              <div className="testPotatoCard">aaaa</div>
            </div>
      {/*  Standalone Card */}



    {/* End HTML */}
    </div>
    )
  }
}

export default publicPage(gridtest)
