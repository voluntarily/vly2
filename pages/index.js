import Landing from './landing/landing'
import Home from './home/home'

const RootPage = (props) => {
  return (
    <>
      {props.isAuthenticated
        ? <Home {...props} />
        : <Landing {...props} />}
    </>)
}

export default RootPage
