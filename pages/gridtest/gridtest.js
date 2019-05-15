import React, { Component } from 'react'

import publicPage, { FullPage, Grid } from '../../hocs/publicPage'
import AwesomeCard from '../../components/TestContainer/AwesomeCard/AwesomeCard'

// import OpListSection from '../../components/Op/OpListSection'

export class gridtest extends Component {
  render () {
    return (
      <div>
        {/* Start HTML */}

        {/*  Grid responsive test */}
        <FullPage>
          <Grid>
            <AwesomeCard />
            <AwesomeCard />
            <AwesomeCard />
            <AwesomeCard />
            <AwesomeCard />
            <AwesomeCard />
            <AwesomeCard />
            <AwesomeCard />
            <AwesomeCard />
            <AwesomeCard />
            <AwesomeCard />
            <AwesomeCard />
            <AwesomeCard />
            <AwesomeCard />
          </Grid>
          {/*  Standalone Card */}
        </FullPage>

        {/* End HTML */}
      </div>
    )
  }
}

export default publicPage(gridtest)
