import { Button, Divider } from 'antd'
import Link from 'next/link'
import { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import RegisterInterestSection from '../Interest/RegisterInterestSection'

export default class OpVolunteerInterestSection extends Component {
  render () {
    return (
      // if not signed in then the interested button signs in first
      !this.props.isAuthenticated
        ? <div>
          <Link href={`/auth/sign-in`} >
            <Button type='primary' shape='round' >
              <FormattedMessage id='iminterested-anon' defaultMessage="I'm Interested" description="I'm interested button that leads to sign in page" />
            </Button>
          </Link>
          <Divider />
        </div>
        : this.props.canRegisterInterest && <div>
          <RegisterInterestSection op={this.props.op} meID={this.props.meID} />
          <Divider />
        </div>
    )
  }
}
