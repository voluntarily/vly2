import publicPage, { FullPage } from '../../hocs/publicPage'
import TitleSection from '../../components/HeroPage/TitleSectionSub'
import BigSearch from '../../components/VTheme/BigSearch'
import { Spacer } from '../../components/VTheme/VTheme'
import OpListSection from '../../components/Op/OpListSection'
import { Component } from 'react'
import PropTypes from 'prop-types'

// const TitleString = {NumberResults} + "results for " + {SearchQuery}

export class SearchPage extends Component {
  // state = {}
  // async componentDidMount () {
  //   // Get all Ops

  //   try {
  //     const ops = await this.props.dispatch(
  //       reduxApi.actions.opportunities.get()
  //     )
  //     // console.log('got ops', ops)
  //     this.setState({ ops })
  //   } catch (err) {
  //     console.log('error in getting ops', err)
  //   }
  // }

  render () {
    return (
      <FullPage>
        <TitleSection title='Search results for tech' />
        <BigSearch />
        <Spacer />
        <OpListSection query={props.query} />
      </FullPage>
    )
  }
}

SearchPage.propTypes = {
  ops: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      subtitle: PropTypes.string,
      imgUrl: PropTypes.any,
      description: PropTypes.string,
      duration: PropTypes.string,
      status: PropTypes.string,
      _id: PropTypes.string
    })
  )
  //  showAddOp: PropTypes.bool.isRequired,
  // dispatch: PropTypes.func.isRequired
}

export default publicPage(SearchPage)
