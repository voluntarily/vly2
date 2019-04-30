// React Components can be very very terse
export default (props) =>
  <div>
    <p className='greeting' >Hello World!</p>
    <p>{props.router.pathname}</p>
  </div>
