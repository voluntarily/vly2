import { Button, Col, Input, Row, Divider } from 'antd'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import Link from 'next/link'
import publicPage, { FullPage, Grid } from '../../hocs/publicPage'
import AwesomeCard from '../../components/TestContainer/AwesomeCard/AwesomeCard'

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
          <FullPage>
            <Grid>
            <AwesomeCard></AwesomeCard>
            <AwesomeCard></AwesomeCard>
            <AwesomeCard></AwesomeCard>
            <AwesomeCard></AwesomeCard>
            <AwesomeCard></AwesomeCard>
            <AwesomeCard></AwesomeCard>
            <AwesomeCard></AwesomeCard>
            <AwesomeCard></AwesomeCard>
            <AwesomeCard></AwesomeCard>
            <AwesomeCard></AwesomeCard>
            <AwesomeCard></AwesomeCard>
            <AwesomeCard></AwesomeCard>
            <AwesomeCard></AwesomeCard>
            <AwesomeCard></AwesomeCard>

            </Grid>
      {/*  Standalone Card */}
      </FullPage>


    {/* End HTML */}
    </div>
    )
  }
}

export default publicPage(gridtest)
