import { Button, Col, Input, Row, Divider } from 'antd'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import Container from '../../components/Container/Container'
import Link from 'next/link'
import publicPage, { FullPage } from '../../hocs/publicPage'

// import OpListSection from '../../components/Op/OpListSection'
import OpListSection from '../../components/Op/OpListSection'
import styles from './grids.less'


import styled from 'styled-components'
const Search = Input.Search

export class gridtest extends Component {
  render () {
      return (
      <div>
      {/* Start HTML */}


          {/*  Grid responsive test */}
          <sectionContainer>
            <div class="fourColumnGrid"> 
              <div class="testPotatoCard">aaaaa</div>
              <div class="testPotatoCard">aaaa</div>
              <div class="testPotatoCard">aaaaaaa</div>
              <div class="testPotatoCard">aaaa</div>

              <div class="testPotatoCard">aaaaa</div>
              <div class="testPotatoCard">aaaa</div>
              <div class="testPotatoCard">aaaa</div>
              <div class="testPotatoCard">aaaa</div>

              <div class="testPotatoCard">aaaa</div>
              <div class="testPotatoCard">aaaa</div>
              <div class="testPotatoCard">aaaa</div>
              <div class="testPotatoCard">aaaa</div>

              <div class="testPotatoCard">aaaaa</div>
              <div class="testPotatoCard">aaaa</div>
              <div class="testPotatoCard">aaaaaaa</div>
              <div class="testPotatoCard">aaaa</div>
            </div>
            </sectionContainer>
    
      {/*  Standalone Card */}
      <div class="cardContainer"></div>


    {/* End HTML */}
    </div>
    )
  }
}

export default publicPage(gridtest)
